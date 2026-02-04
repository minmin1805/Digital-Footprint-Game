import React, { useRef } from "react";
import detectivekid from "../assets/GamePage/EndGamePopup/detectivekid.png";
import { TiTick } from "react-icons/ti";
import sheildlogo from "../assets/GamePage/EndGamePopup/shieldlogo.png";
import banner from "../assets/GamePage/EndGamePopup/banner.png";
import { IoMdDownload } from "react-icons/io";
import redpin from "../assets/GamePage/EndGamePopup/redpin.png";
import PdfChecklist from "./PdfChecklist";
import { captureElementAsPdf } from "../lib/pdfChecklist";

function GameEndPopup({
  onPlayAgain,
  unsafePostsFound = 0,
  categoriesFound = 0,
  playAgainLoading = false,
  playAgainError = null,
}) {
  const foundAllFive = categoriesFound >= 5
  const checklistRef = useRef(null)

  async function downloadSafetyChecklist() {
    try {
      await captureElementAsPdf(checklistRef.current);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    }
  }

  return (
    <>
      {/* Hidden checklist for PDF capture - rendered off-screen at A4 dimensions */}
      <div
        ref={checklistRef}
        className="fixed left-[-9999px] top-0"
        style={{ width: '794px' }}
        aria-hidden
      >
        <PdfChecklist />
      </div>
    <div className="fixed flex items-center justify-center p-2 sm:p-4 pt-20 sm:pt-24 inset-0 z-50 overflow-y-auto overflow-x-visible">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden
      />
      <div className="relative w-full max-w-xl my-auto overflow-visible">
        <img
          src={banner}
          alt=""
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 min-w-[150%] max-h-35 object-contain object-center pointer-events-none"
          aria-hidden
        />
        <div className="relative w-full rounded-2xl border-4 border-green-800 shadow-xl p-3 bg-green-800 max-h-[85vh] overflow-y-auto">
          <div className="bg-amber-100 rounded-2xl flex flex-col items-center justify-center pt-14 overflow-hidden">
            <div className="flex justify-between items-center w-full gap-2">
              {foundAllFive ? (
                <p className="max-w-md text-center text-xl font-bold text-gray-900 ml-4 mt-2">
                  You found all 5 privacy risk categories and learned to protect
                  your digital footprint! You spotted {unsafePostsFound} unsafe
                  post{unsafePostsFound === 1 ? '' : 's'} in total.
                </p>
              ) : (
                <p className="max-w-md text-center text-xl font-bold text-gray-900 ml-4 mt-2">
                  You found {categoriesFound}/5 privacy risk categories. You
                  spotted {unsafePostsFound} unsafe post{unsafePostsFound === 1 ? '' : 's'}{' '}
                  in total. Keep practicing — play again to find all 5 and become
                  a Digital Footprint Detective!
                </p>
              )}
              <img
                src={detectivekid}
                alt=""
                className="w-36 h-36 shrink-0 object-contain"
              />
            </div>

          <div className="w-full rounded-2xl overflow-hidden px-4">
            <div className="rounded-2xl overflow-hidden">
              <div className="bg-green-500 p-3">
                <p className="text-xl font-bold text-white">What You Learned:</p>
              </div>
              <div className="bg-amber-200 p-2">
                <ul>
                  <li>
                    <div className="flex items-center gap-2">
                      <TiTick className="w-7 h-7 text-green-500 rounded-full shrink-0" />
                      <p className="text-base text-gray-900">
                        Check photo backgrounds for house numbers/street signs/license plate
                      </p>
                    </div>
                    <div className="my-1.5 h-px bg-gray-300" />
                    <div className="flex items-center gap-2">
                      <TiTick className="w-7 h-7 text-green-500 rounded-full shrink-0" />
                      <p className="text-base text-gray-900">
                        Actions online strangers can take to target and harm you
                      </p>
                    </div>
                    <div className="my-1.5 h-px bg-gray-300" />
                    <div className="flex items-center gap-2">
                      <TiTick className="w-7 h-7 text-green-500 rounded-full shrink-0" />
                      <p className="text-base text-gray-900">
                        Don&apos;t show school names on clothing or certificates
                      </p>
                    </div>
                    <div className="my-1.5 h-px bg-gray-300" />
                    <div className="flex items-center gap-2">
                      <TiTick className="w-7 h-7 text-green-500 rounded-full shrink-0" />
                      <p className="text-base text-gray-900">
                        Never share full birthdates, location check-in tags in your posts
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl w-full mt-4 p-2">
              <div className="flex items-center gap-2 pl-1 mb-2">
                <img src={redpin} alt="" className="w-8 h-8" />
                <p className="text-xl font-bold text-green-600">Remember:</p>
              </div>
              <div className="flex items-center justify-between gap-3">
                <ul>
                  <li className="flex items-center gap-2">
                    <TiTick className="w-6 h-6 text-green-500 rounded-full shrink-0" />
                    <p className="text-base text-gray-900">What&apos;s in the background?</p>
                  </li>
                  <div className="my-1.5 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-6 h-6 text-green-500 rounded-full shrink-0" />
                    <p className="text-base text-gray-900">What does the text say?</p>
                  </li>
                  <div className="my-1.5 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-6 h-6 text-green-500 rounded-full shrink-0" />
                    <p className="text-base text-gray-900">Are location tags on?</p>
                  </li>
                  <div className="my-1.5 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-6 h-6 text-green-500 rounded-full shrink-0" />
                    <p className="text-base text-gray-900">Could someone find me with this info?</p>
                  </li>
                </ul>
                <img src={sheildlogo} alt="" className="w-28 h-28 shrink-0 mr-4 mb-4" />
              </div>
            </div>

            {foundAllFive && (
            <p className="text-center text-lg text-gray-900 mt-5 px-6">
              You're now a{" "}
              <span className="font-bold text-green-500">
                Digital Footprint Detective!
              </span>{" "}
              Use these skills every time you post online.
            </p>
            )}
            <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2 mb-4 sm:mb-5">
              <button
                type="button"
                onClick={downloadSafetyChecklist}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-center transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <IoMdDownload className="w-5 h-5 sm:w-6 sm:h-6" />
                Download Safety Checklist!
              </button>
              {playAgainError && (
                <p className="text-xs sm:text-sm text-amber-700">{playAgainError}</p>
              )}
              <button
                onClick={onPlayAgain}
                disabled={playAgainLoading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-center transition-colors text-sm sm:text-base"
              >
                {playAgainLoading ? 'Saving...' : 'Play again'}
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default GameEndPopup;
