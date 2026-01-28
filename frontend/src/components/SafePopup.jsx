import React from 'react'
import safeIcon from '../assets/GamePage/SafePost/shieldicon.png'
import cameraIcon from '../assets/GamePage/SafePost/cameraicon.png'
/**
 * Safe post popup – shown when player clicks a safe post 4+ times.
 * Receives { post } with post.safeExplanation (title, whyOk[], keepSharing).
 */
function SafePopup({ post, onClose }) {
  const safe = post?.safeExplanation
  if (!post || !safe) return null

  const { title, whyOk = [], keepSharing } = safe

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
        aria-labelledby="safe-popup-title"
        aria-modal="true"
      >
        {/* Header: Safe post! */}
        <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500">
          <img src={safeIcon} alt="safe post" className='w-20 h-20 mr-1' />
          <h2 id="safe-popup-title" className="text-4xl font-bold text-white">
            Safe post!
          </h2>
        </div>

        {/* Body */}
        <div className="px-4 py-4 space-y-4">
          <div>
            <p className="text-2xl text-gray-900">
              POST {post.index}
              {title ? ` – ${title}` : ''}
            </p>
            <div className="my-2 h-px bg-gray-300" />
          </div>

          {/* Why it's okay (bullets) */}
          {Array.isArray(whyOk) && whyOk.length > 0 && (
            <div className="rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-emerald-500">
                <p className="text-xl font-bold text-white">Why it&apos;s okay:</p>
              </div>
              <div className="bg-gray-100 px-3 py-3 rounded-b-lg">
                <ul className="list-disc list-inside space-y-1 text-lg text-gray-800">
                  {whyOk.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Keep sharing (with camera icon) */}
          {keepSharing && (
            <div className="rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-emerald-500">
                <p className="text-xl font-bold text-white">Why it&apos;s okay:</p>
              </div>
              <div className="bg-gray-100 px-3 py-3 rounded-b-lg flex items-start gap-3">
                <p className="text-lg text-gray-800 flex-1">{keepSharing}</p>
                <img src={cameraIcon} alt="camera" className='w-18 h-18' />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Awesome!! */}
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-center transition-colors"
          >
            Awesome!!
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default SafePopup
