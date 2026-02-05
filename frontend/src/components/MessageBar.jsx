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
    <aside className="flex flex-col items-center shrink-0 py-2 sm:py-4 gap-3 sm:gap-6 w-full min-w-0 overflow-visible">
      {/* Category found indicator */}
      <div className="flex flex-col gap-2 sm:gap-4 w-full">
        <p className="text-xs sm:text-base font-bold text-gray-700 text-center leading-tight break-words w-full px-0.5">
          Categories found
        </p>
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
                className={`w-8 h-8 sm:w-12 sm:h-12 object-contain shrink-0 transition-all duration-300 ${
                  isFound ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
              />
              <span className="text-xs sm:text-[15px] font-bold text-gray-700 text-center leading-tight w-full break-words">
                {title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Rules button - pause and review */}
      <button
        type="button"
        onClick={handleRulesClick}
        className="flex flex-col items-center gap-1 sm:gap-2 hover:cursor-pointer bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 rounded-lg mt-2 sm:mt-4 shrink-0"
        aria-label="Pause and review game rules"
      >
        <img
          src={instructionLogo}
          alt=""
          className="w-8 h-8 sm:w-12 sm:h-12 object-contain shrink-0"
        />
        <p className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight max-w-[70px] sm:max-w-[80px]">
          Pause and review rules
        </p>
      </button>
    </aside>
  )
}
