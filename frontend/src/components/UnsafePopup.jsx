import React from 'react'
import alertIcon from '../assets/GamePage/UnsafePost/alerticon.png'
import hackerIcon from '../assets/GamePage/UnsafePost/hackericon.png'
import lightbulbIcon from '../assets/GamePage/UnsafePost/lightbulbicon.png'

/**
 * Unsafe alert popup – shown when player correctly spots a privacy risk.
 * Receives { post, zone } with zone.explanation (title, whatFound, whyDangerous, whatToDoInstead, quickTip).
 */
function UnsafePopup({ post, zone, onClose }) {
  if (!post || !zone?.explanation) return null

  const { title, whatFound, whyDangerous, whatToDoInstead, quickTip } = zone.explanation
  const categoryLabel = zone.category?.replace(/_/g, ' ') || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden
      />

      {/* Popup card - scrollable on small screens */}
      <div className='relative w-full max-w-xl max-h-[90vh] bg-gray rounded-2xl border-gray-950 border-3 shadow-xl overflow-hidden p-5 bg-gray-300'>
      <div
        className="bg-white rounded-2xl overflow-y-auto max-h-[calc(90vh-2.5rem)]"
        role="dialog"
        aria-labelledby="unsafe-popup-title"
        aria-modal="true"
      >
        {/* Header: Unsafe alert */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#A93226]">
          <img src={alertIcon} alt="alert" className='w-25 h-20 mr-1' />
          <h2 id="unsafe-popup-title" className="text-4xl font-bold text-white">
            Unsafe alert
          </h2>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-2xl text-gray-900">
                POST {post.index} – {title}
              </p>
              <div className="my-3 h-[2px] bg-gray-800 my-2" />
              <p className="text-xl text-gray-800">
                <span className="font-semibold">Category:</span>{' '}
                {categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)}
              </p>
              <p className="text-xl text-gray-800 mt-1">
                <span className="font-semibold">What you found:</span> {whatFound}
              </p>
            </div>
            <img
              src={hackerIcon}
              alt=""
              className="w-30 h-30 shrink-0 object-contain mt-4"
              aria-hidden
            />
          </div>

          {/* Why this is dangerous */}
          <div className="rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-[#A93226]">
              <p className="text-xl font-bold text-white">Why this is dangerous:</p>
            </div>
            <div className="bg-gray-100 px-3 py-3">
              <p className="text-lg text-gray-800">{whyDangerous}</p>
            </div>
          </div>

          {/* What to do instead */}
          <div className="rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-[#A93226]">
              <p className="text-xl font-bold text-white">What to do instead:</p>
            </div>
            <div className="bg-gray-100 px-3 py-3">
              <ul className="list-disc list-inside space-y-1 text-lg text-gray-800">
                {Array.isArray(whatToDoInstead)
                  ? whatToDoInstead.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))
                  : <li>{whatToDoInstead}</li>}
              </ul>
            </div>
          </div>

          {/* Quick tip */}
          <div className="rounded-lg overflow-hidden py-2 px-3 bg-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <img src={lightbulbIcon} alt="lightbulb" className='w-12 h-12 mr-1' />
              <p className="text-2xl font-bold text-gray-900 mt-1">Quick tip:</p>
            </div>
            <div className="h-px bg-gray-200 mb-2" />
            <p className="text-lg text-gray-800">{quickTip}</p>
          </div>
        </div>

        {/* Footer: Ok, Got it! */}
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-center transition-colors"
          >
            Ok, Got it!
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default UnsafePopup
