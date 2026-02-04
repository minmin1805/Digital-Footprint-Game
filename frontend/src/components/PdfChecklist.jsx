import React from 'react'
import ourRescueLogo from '../assets/PdfChecklist/Logo.png'

// Our Rescue brand colors
const navy = 'rgb(24, 32, 70)'
const mediumBlue = 'rgb(60, 143, 235)'
const gold = 'rgb(218, 165, 32)'
const brightOrange = 'rgb(234, 92, 55)'
const parchment = 'rgb(250, 248, 240)'

function Checkbox({ checked }) {
  return (
    <span className="inline-flex w-3.5 h-3.5 border-2 border-[rgb(24,32,70)] rounded-sm shrink-0 items-center justify-center">
      {checked && (
        <svg className="w-2.5 h-2.5 text-[rgb(234,92,55)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  )
}

export default function PdfChecklist() {
  const categories = [
    { icon: 'LOCATION', items: ['House numbers', 'Street signs', 'Location tags (turn OFF!)'] },
    { icon: 'SCHOOL', items: ['School name on clothing/signs', 'School logos or mascots', 'Classroom numbers'] },
    { icon: 'PERSONAL INFO', items: ['Full birthdate (especially year!)', 'Phone numbers', 'Full name on documents'] },
    { icon: 'ROUTINES', items: ['Class schedules', 'Regular times ("Every Tue 3pm")', 'Predictable patterns'] },
    { icon: 'FAMILY', items: ['License plates (blur them!)', 'Addresses on packages', "Family members' info"] },
  ]

  const safeItems = [
    'Your face (private accounts only)',
    'Hobbies and interests',
    'Food close-ups',
    'Nature photos',
    'Pets (generic backgrounds)',
    'Art projects',
    'Achievements (cover school names!)',
    'Friend photos (blur backgrounds)',
  ]

  const questions = [
    "What's in the background?",
    'What does the text say?',
    'Are location tags on?',
    'Could someone find me?',
  ]

  const doubtItems = [
    'Blur it out (photo editing apps)',
    "Crop it out (zoom in)",
    "Leave it out (don't post)",
    'Ask a parent first',
  ]

  const privacyItems = [
    'Set account to PRIVATE',
    'Turn OFF location services',
    'Friends only: comments, messages, tags',
    'Hide birthday from public',
    "Don't accept stranger requests",
  ]

  function SectionBanner({ children, color = gold }) {
    return (
      <div className="py-2 px-3 text-white font-bold text-sm" style={{ backgroundColor: color }}>
        {children}
      </div>
    )
  }

  return (
    <div
      className="min-h-[1123px] w-full bg-[rgb(250,248,240)] p-4 border-[4px] box-border"
      style={{ borderColor: navy, width: '100%' }}
    >
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-4 mb-4" style={{ backgroundColor: navy }}>
        <img src={ourRescueLogo} alt="Our Rescue" className="h-12 w-auto object-contain" />
        <div>
          <h1 className="text-white text-xl font-bold">DIGITAL FOOTPRINT DETECTIVE</h1>
          <p className="text-white text-sm">Social Media Safety Checklist</p>
        </div>
      </div>

      {/* BEFORE YOU POST */}
      <SectionBanner>✓ BEFORE YOU POST</SectionBanner>
      <p className="text-sm py-2 font-medium" style={{ color: navy }}>
        Check your photo for these 8 privacy risks:
      </p>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map((cat, i) => (
          <div key={cat.icon} className="space-y-2">
            <div
              className="py-1.5 px-2 text-white font-bold text-xs"
              style={{ backgroundColor: i % 2 === 0 ? gold : mediumBlue }}
            >
              {cat.icon}
            </div>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-xs" style={{ color: navy }}>
                  <Checkbox checked={false} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* SAFE TO SHARE */}
      <SectionBanner>SAFE TO SHARE</SectionBanner>
      <ul className="space-y-1.5 py-3">
        {safeItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: navy }}>
            <Checkbox checked />
            {item}
          </li>
        ))}
      </ul>

      {/* 4-QUESTION CHECK */}
      <SectionBanner color={mediumBlue}>4-QUESTION CHECK</SectionBanner>
      <p className="text-sm py-2" style={{ color: navy }}>
        Before posting, ask:
      </p>
      <ol className="list-decimal list-inside space-y-1.5 text-sm mb-2" style={{ color: navy }}>
        {questions.map((q) => (
          <li key={q}>{q}</li>
        ))}
      </ol>
      <p className="text-sm font-bold mb-5" style={{ color: brightOrange }}>
        If YES to #4 → Don&apos;t post or edit first!
      </p>

      {/* Page break: push WHEN IN DOUBT to start of page 2 */}
      <div aria-hidden style={{ minHeight: '200px' }} />

      {/* WHEN IN DOUBT - starts on page 2 */}
      <SectionBanner color={mediumBlue}>WHEN IN DOUBT</SectionBanner>
      <ul className="space-y-1.5 py-3">
        {doubtItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: navy }}>
            <Checkbox checked={false} />
            {item}
          </li>
        ))}
      </ul>

      {/* PRIVACY SETTINGS */}
      <SectionBanner>PRIVACY SETTINGS</SectionBanner>
      <ul className="space-y-1.5 py-3">
        {privacyItems.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm" style={{ color: navy }}>
            <Checkbox checked />
            {item}
          </li>
        ))}
      </ul>

      {/* NEED HELP? */}
      <SectionBanner color={brightOrange}>NEED HELP?</SectionBanner>
      <div className="py-3 space-y-1 text-sm" style={{ color: navy }}>
        <p><strong>Call:</strong> 1-800-THE-LOST</p>
        <p><strong>Report:</strong> cybertipline.org | takeitdown.ncmec.org</p>
        <p><strong>Tell:</strong> Parent, teacher, counselor, police</p>
        <p className="font-bold mt-2" style={{ color: brightOrange }}>
          Remember: It&apos;s NEVER your fault!
        </p>
      </div>

      {/* QUICK TIP */}
      <SectionBanner>QUICK TIP</SectionBanner>
      <div className="py-3 text-sm space-y-1" style={{ color: navy }}>
        <p className="font-bold">Your posts last FOREVER.</p>
        <p>Once online, you lose control.</p>
        <p>Think before you share!</p>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 mt-4"
        style={{ backgroundColor: navy }}
      >
        <div>
          <p className="text-white font-bold">You&apos;re a Digital Footprint Detective!</p>
          <p className="text-white text-sm">Use these skills every time you post.</p>
        </div>
        <p className="text-white text-sm">www.ourrescue.org</p>
        <img src={ourRescueLogo} alt="Our Rescue" className="h-8 w-auto object-contain" />
      </div>
    </div>
  )
}
