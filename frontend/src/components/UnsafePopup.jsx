import React from 'react'

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

      {/* Popup card */}
      <div className='relative w-full max-w-xl bg-gray rounded-2xl border-gray-950 border-3 shadow-xl overflow-hidden p-5 bg-gray-300'>
      <div
        className=" bg-white rounded-2xl overflow-hidden"
        role="dialog"
        aria-labelledby="unsafe-popup-title"
        aria-modal="true"
      >
        {/* Header: Unsafe alert */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#A93226]">
          <div className="flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-amber-400">
            <span className="text-2xl font-bold text-black">!</span>
          </div>
          <h2 id="unsafe-popup-title" className="text-4xl font-bold text-white">
            Unsafe alert
          </h2>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-2xl text-gray-900">
              POST {post.index} – {title}
            </p>
            <div className=" my-2 h-px bg-gray-300" />
            <p className="text-xl text-gray-800">
              <span className="font-semibold">Category:</span>{' '}
              {categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)}
            </p>
            <p className="text-xl text-gray-800 mt-1">
              <span className="font-semibold">What you found:</span> {whatFound}
            </p>
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
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-500" aria-hidden>
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </span>
              <p className="text-2xl font-bold text-gray-900">Quick tip:</p>
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
