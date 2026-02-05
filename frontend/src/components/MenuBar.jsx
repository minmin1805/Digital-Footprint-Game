import React from 'react'

const navItems = [
  { id: 'home', label: 'Home', icon: 'home', active: true },
  { id: 'reels', label: 'Reels', icon: 'play' },
  { id: 'messages', label: 'Messages', icon: 'send' },
  { id: 'search', label: 'Search', icon: 'search' },
  { id: 'explore', label: 'Explore', icon: 'compass' },
  { id: 'create', label: 'Create', icon: 'plus' },
  { id: 'profile', label: 'Profile', icon: 'user' },
]

function Icon({ name, active }) {
  const cn = `w-8 h-8 ${active ? 'text-gray-900' : 'text-gray-500'}`
  switch (name) {
    case 'home':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      )
    case 'play':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      )
    case 'send':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      )
    case 'search':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
        </svg>
      )
    case 'compass':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
        </svg>
      )
    case 'plus':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      )
    case 'user':
      return (
        <svg className={cn} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      )
    default:
      return null
  }
}

export default function MenuBar() {
  return (
    <aside className="flex flex-col gap-2 sm:gap-4 shrink-0 py-2 sm:py-4 w-full max-w-[100px] overflow-visible">
      {navItems.map(({ id, label, icon, active }) => (
        <div
          key={id}
          className={`flex flex-col items-center gap-1 ${active ? 'font-bold text-gray-900' : 'text-gray-500'}`}
        >
          <Icon name={icon} active={active} />
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </aside>
  )
}
