import React from "react";
import detectivekid from "../assets/GamePage/EndGamePopup/detectivekid.png";
import { TiTick } from "react-icons/ti";
import { TiPin } from "react-icons/ti";
import sheildlogo from "../assets/GamePage/EndGamePopup/shieldlogo.png";
import banner from "../assets/GamePage/EndGamePopup/banner.png";
import { IoMdDownload } from "react-icons/io";
import redpin from "../assets/GamePage/EndGamePopup/redpin.png";

function GameEndPopup({ onClose }) {
  return (
    <div className="fixed flex items-center justify-center p-4 inset-0 z-50 pt-20 ">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden
      />
      {/* Wrapper: no overflow-hidden so banner can extend above/sides */}
      <div className="relative w-full max-w-2xl">
        {/* Banner: sits on top edge, lying over popup — centered, wider, half above half over */}
        <img
          src={banner}
          alt=""
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 z-10 w-[120%] max-w-none object-contain pointer-events-none"
          aria-hidden
        />
        {/* Popup card */}
        <div className="relative w-full rounded-2xl border-4 border-green-800 shadow-xl p-3 bg-green-800">
          <div className="bg-amber-100 rounded-2xl flex flex-col items-center justify-center pt-16 overflow-hidden">
            <div className="flex justify-between items-center w-full">
              <p className="max-w-2xl text-center text-2xl font-bold text-gray-900 ml-5 mt-2">
                You found 8/8 privacy risks and learned to protect your digital
                footprint!
              </p>
              <img
                src={detectivekid}
                alt=""
                className="w-48 h-48 shrink-0 object-contain"
              />
            </div>

          <div className="w-full rounded-2xl overflow-hidden px-4 ">
            <div className='rounded-2xl overflow-hidden'>
              {" "}
              <div className="bg-green-500 p-5">
                <p className="text-2xl font-bold text-white">What You Learned:</p>
              </div>
              <div className=" bg-amber-200 p-2">
                <ul>
                  <li>
                    <div className="flex items-center">
                      <TiTick className="w-10 h-10 text-green-500  rounded-full" />
                      <p className="text-lg text-gray-900">
                        {" "}
                        Check photo backgrounds for house numbers/street
                        signs/license plate
                      </p>
                    </div>
                    <div className="my-2 h-px bg-gray-300" />
                    <div className="flex items-center ">
                      <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                      <p className="text-lg text-gray-900">
                        Actions online strangers can take to target and harm you
                      </p>
                    </div>
                    <div className="my-2 h-px bg-gray-300" />
                    <div className="flex items-center">
                      <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                      <p className="text-lg text-gray-900">
                        Don't show school names on clothing or certificates{" "}
                      </p>
                    </div>
                    <div className="my-2 h-px bg-gray-300" />
                    <div className="flex items-center">
                      <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                      <p className="text-lg text-gray-900">
                        Never share full birthdates, location check-in tags in
                        your
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl w-full mt-7 p-2">
              <div className="flex items-center gap-2 pl-1 mb-2">
                <img src={redpin} alt="redpin" className="w-9 h-9" />
                <p className="text-2xl font-bold text-green-600">Remember:</p>
              </div>
              <div className="flex items-center justify-between gap-3 ">
                <ul>
                  <li className="flex items-center gap-2">
                    <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                    <p className="text-lg text-gray-900">What's in the background?</p>
                  </li>
                  <div className="my-2 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                    <p className="text-lg text-gray-900">What does the text say?</p>
                  </li>
                  <div className="my-2 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                    <p className="text-lg text-gray-900">Are location tags on?</p>
                  </li>
                  <div className="my-2 h-px bg-gray-300" />
                  <li className="flex items-center gap-2">
                    <TiTick className="w-10 h-10 text-green-500 rounded-full" />
                    <p className="text-lg text-gray-900">Could someone find me with this info?</p>
                  </li>
                </ul>
                <img src={sheildlogo} alt="sheildlogo" className="w-40 h-40 mr-5 mb-5" />
              </div>
            </div>

            <p className="text-center text-xl text-gray-900 mt-7 px-10">
              You're now a{" "}
              <span className="font-bold text-green-500">
                Digital Footprint Detective!
              </span>{" "}
              Use these skills every time you post online.
            </p>
            <div className="mt-7 flex items-center justify-center gap-3 mb-7">
              <button className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-center transition-colors flex items-center justify-center gap-2">
                <IoMdDownload className="w-6 h-6" />
                Download Safety Checklist!
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-center transition-colors"
              >
                Play again
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default GameEndPopup;
