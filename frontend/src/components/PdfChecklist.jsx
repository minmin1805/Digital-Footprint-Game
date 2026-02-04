import React, { useRef, useLayoutEffect, useState } from 'react'
import ourRescueLogo from '../assets/PdfChecklist/Logo.png'
import ourRescueTrainingLogo from '../assets/PdfChecklist/ORLogo.png'

// A4 page height in px when content width is 794px
const PAGE_HEIGHT_PX = Math.round(794 * (297 / 210))
const PAGE_2_TOP_PADDING = 24 // small breathing room at top of page 2

// Our Rescue brand colors
const navy = 'rgb(24, 32, 70)'
const mediumBlue = 'rgb(60, 143, 235)'
const gold = 'rgb(218, 165, 32)'
const brightOrange = 'rgb(234, 92, 55)'
const parchment = 'rgb(250, 248, 240)'

function Checkbox({ checked }) {
  return (
    <span
      className="inline-flex w-3.5 h-3.5 border-2 border-[rgb(24,32,70)] rounded-sm shrink-0 items-center justify-center"
      style={{
        display: 'inline-flex',
        verticalAlign: 'middle',
        marginRight: '0.5rem',
        transform: 'translateY(3px)',
      }}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-[rgb(234,92,55)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </span>
  )
}

export default function PdfChecklist() {
  const contentRef = useRef(null)
  const [spacerHeight, setSpacerHeight] = useState(0)

  useLayoutEffect(() => {
    if (!contentRef.current) return
    const rootPadding = 16 // p-4 top padding
    const contentBottom = rootPadding + contentRef.current.offsetHeight
    const needed = Math.max(0, PAGE_HEIGHT_PX - contentBottom + PAGE_2_TOP_PADDING)
    setSpacerHeight(needed)
  }, [])

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
      className="min-h-[1123px] w-full bg-[rgb(250,248,240)] p-4 border-[4px] box-border pdf-checklist-root"
      style={{
        borderColor: navy,
        width: '100%',
        letterSpacing: '0.03em',
        fontFamily: 'Helvetica, Arial, sans-serif',
        wordSpacing: '0.05em',
      }}
    >
      <div ref={contentRef}>
      {/* Header - logo and title left-aligned */}
      <div className="flex items-center gap-4 px-4 py-4 mb-0" style={{ backgroundColor: navy }}>
        <img src={ourRescueLogo} alt="Our Rescue" className="h-12 w-auto object-contain shrink-0" />
        <div className="text-left mb-2">
          <h1 className="text-white text-xl font-bold">DIGITAL FOOTPRINT DETECTIVE</h1>
          <p className="text-white text-sm">Social Media Safety Checklist</p>
        </div>
      </div>

      {/* Lead-in: positive reinforcement below header */}
      <div className="px-4 py-4 mb-4 border-b-2" style={{ borderColor: navy }}>
        <p className="text-base font-medium leading-relaxed" style={{ color: navy }}>
          You&apos;re a Digital Footprint Detective! You explored how to spot privacy risks in photos and captions, what&apos;s safe to share, and how to protect yourself online. Use this checklist every time you post—you&apos;ve got the skills to keep your digital footprint safe.
        </p>
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
                <li key={item} className="text-xs" style={{ color: navy, lineHeight: 1.5, listStyle: 'none' }}>
                  <Checkbox checked={false} />
                  <span style={{ verticalAlign: 'middle' }}>{item}</span>
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
          <li key={item} className="text-sm" style={{ color: navy, lineHeight: 1.5, listStyle: 'none' }}>
            <Checkbox checked />
            <span style={{ verticalAlign: 'middle' }}>{item}</span>
          </li>
        ))}
      </ul>

      {/* 4-QUESTION CHECK */}
      <SectionBanner color={mediumBlue}>4-QUESTION CHECK</SectionBanner>
      <p className="text-sm py-2" style={{ color: navy }}>
        Before posting, ask:
      </p>
      <ol className="space-y-1.5 text-sm mb-2" style={{ color: navy, listStyle: 'decimal', paddingLeft: '1.5rem' }}>
        {questions.map((q, i) => (
          <li key={q} className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center' }}>
            <span className="shrink-0" style={{ width: '1.5rem', textAlign: 'right' }}>{i + 1}.</span>
            <span style={{ lineHeight: 1.4 }}>{q}</span>
          </li>
        ))}
      </ol>
      </div>

      {/* Spacer: fills remainder of page 1 so WHEN IN DOUBT starts at top of page 2 with no blank */}
      <div aria-hidden style={{ minHeight: spacerHeight }} />

      {/* WHEN IN DOUBT - starts on page 2 */}
      <SectionBanner color={mediumBlue}>WHEN IN DOUBT</SectionBanner>
      <ul className="space-y-1.5 py-3">
        {doubtItems.map((item) => (
          <li key={item} className="text-sm" style={{ color: navy, lineHeight: 1.5, listStyle: 'none' }}>
            <Checkbox checked={false} />
            <span style={{ verticalAlign: 'middle' }}>{item}</span>
          </li>
        ))}
      </ul>

      {/* PRIVACY SETTINGS */}
      <SectionBanner>PRIVACY SETTINGS</SectionBanner>
      <ul className="space-y-1.5 py-3">
        {privacyItems.map((item) => (
          <li key={item} className="text-sm" style={{ color: navy, lineHeight: 1.5, listStyle: 'none' }}>
            <Checkbox checked />
            <span style={{ verticalAlign: 'middle' }}>{item}</span>
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

      {/* Footer - simplified */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 mt-4"
        style={{ backgroundColor: navy }}
      >
        <p className="text-white text-sm">www.ourrescue.org</p>
        <img src={ourRescueTrainingLogo} alt="Our Rescue" className="h-8 w-auto object-contain" />
      </div>
    </div>
  )
}
