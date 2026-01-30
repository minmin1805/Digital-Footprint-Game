import React from 'react'
import { useGame } from '../context/GameContext'
import instructionLogo from '../assets/GamePage/InstructionLogo/instructionlogo.png'
import mapImage from '../assets/InstructionPage/map.png'
import schoolImage from '../assets/InstructionPage/school.png'
import passportImage from '../assets/InstructionPage/passport.png'
import scheduleImage from '../assets/InstructionPage/schedule.png'
import familyImage from '../assets/InstructionPage/family.png'

const CATEGORIES = [
  { slug: 'location', title: 'Location', image: mapImage },
  { slug: 'school_identity', title: 'School', image: schoolImage },
  { slug: 'personal_identifiers', title: 'Personal ID', image: passportImage },
  { slug: 'daily_routines', title: 'Routines', image: scheduleImage },
  { slug: 'family_home', title: 'Family & Home', image: familyImage },
]

export default function MessageBar() {
  const { foundItems, setCurrentPopup, setIsPaused } = useGame()
  const categoriesFound = new Set(foundItems.map((f) => f.category))

  const handleRulesClick = () => {
    setIsPaused(true)
    setCurrentPopup({ type: 'instruction', data: {} })
  }

  return (
    <aside className="flex flex-col items-center shrink-0 py-4 gap-6">
      {/* Category found indicator */}
      <div className="flex flex-col gap-4">
        <p className="text-lg font-bold text-gray-700 text-center">Categories found</p>
        {CATEGORIES.map(({ slug, title, image }) => {
          const isFound = categoriesFound.has(slug)
          return (
            <div
              key={slug}
              className="flex flex-col items-center"
              title={isFound ? `${title} found` : `${title} not yet found`}
            >
              <img
                src={image}
                alt={title}
                className={`w-25 h-17 object-contain shrink-0 transition-all duration-300 ${
                  isFound ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
              />
              <span className="text-[15px] font-bold text-gray-700 text-center leading-tight max-w-[60px]">
                {title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rules button */}
      <button
        type="button"
        onClick={handleRulesClick}
        className="flex flex-col items-center gap-2 hover:cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-lg mt-4"
        aria-label="Pause and review game rules"
      >
        <img
          src={instructionLogo}
          alt=""
          className="w-25 h-25 object-contain shrink-0"
        />
        <p className="text-xs font-medium text-gray-700 text-center leading-tight max-w-[80px]">
          Pause and review game&apos;s rules
        </p>
      </button>
    </aside>
  )
}
