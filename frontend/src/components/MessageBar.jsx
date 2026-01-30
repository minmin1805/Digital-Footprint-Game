import React from 'react'
import person1 from '../assets/GamePage/FriendIcons/person1.png'
import person2 from '../assets/GamePage/FriendIcons/person2.png'
import person3 from '../assets/GamePage/FriendIcons/person3.png'
import instructionLogo from '../assets/GamePage/InstructionLogo/instructionlogo.png'
const messageAvatars = [
  { id: 1, image: person1 },
  { id: 2, image: person2 },
  { id: 3, image: person3 },
]

export default function MessageBar() {
  return (
    <aside className="flex flex-col items-center shrink-0 py-4 gap-4 ">
      {/* Messages vertical bar */}
      <div className="flex flex-col items-center gap-7 bg-blue-400 rounded-xl border-l-4 border-pink-400 py-4 mb-20">
        <div className="flex flex-col gap-2">
          {messageAvatars.map(({ id, image }) => (
            <img
              key={id}
              src={image}
              alt=""
              className="w-8 h-8 rounded-full border-2 border-white object-cover"
            />
          ))}
        </div>
        <span
          className="text-sm font-semibold text-gray-700 whitespace-nowrap block -rotate-90 origin-center"
          style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
        >
          Messages
        </span>
        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </div>

      {/* Rules button */}
      <div className="flex flex-col items-center gap-2 hover:cursor-pointer">
        <img
          src={instructionLogo}
          alt="instruction logo"
          className="w-25 h-25 object-contain shrink-0"
        />
        <p className="text-xs font-medium text-gray-700 text-center leading-tight max-w-[80px]">
          Pause and review game's rules
        </p>
      </div>
    </aside>
  )
}
