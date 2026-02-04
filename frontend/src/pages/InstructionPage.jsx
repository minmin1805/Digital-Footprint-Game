import React from "react";
import { useNavigate } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import shieldlogo from "../assets/GamePage/EndGamePopup/shieldlogo.png";
import schoolImage from "../assets/InstructionPage/school.png";
import mapImage from "../assets/InstructionPage/map.png";
import familyImage from "../assets/InstructionPage/family.png";
import passportImage from "../assets/InstructionPage/passport.png";
import scheduleImage from "../assets/InstructionPage/schedule.png";

function MagnifyingGlassIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const RISK_CARDS = [
  {
    num: 1,
    title: "Location Information",
    headerBg: "bg-blue-600",
    examples: "Addresses, street signs, house numbers.",
    image: mapImage,
  },
  {
    num: 2,
    title: "School Identity",
    headerBg: "bg-green-600",
    examples: "School names, logos, uniforms.",
    image: schoolImage,
  },
  {
    num: 3,
    title: "Personal Identifiers",
    headerBg: "bg-amber-500",
    examples: "Full names, birthdates, IDs.",
    image: passportImage,
  },
  {
    num: 4,
    title: "Daily Routines & Schedules",
    headerBg: "bg-purple-600",
    examples: "Class schedules, practice times.",
    image: scheduleImage,
  },
  {
    num: 5,
    title: "Family & Home",
    headerBg: "bg-red-600",
    examples: "License plates, family info.",
    image: familyImage,
  },
];

export default function InstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full  py-8 pt-30">
      <div className="max-w-4xl mx-auto rounded-2xl border-2 border-amber-200 bg-amber-50/90 shadow-lg overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {/* Welcome + intro + shield */}
          <div className="relative">
            <div className="pr-28 md:pr-36">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Welcome to Digital Footprint Detective!
              </h1>
              <p className="text-gray-700 leading-relaxed mb-3 text-lg">
                Your mission is to review social media posts and spot anything
                that could put someone&apos;s privacy or safety at risk.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4 text-lg">
                Every time you catch a risky detail, you earn points and learn
                how to post smarter and safer online.
              </p>
              <div className="flex items-center gap-2 text-gray-700 font-medium">
                <MagnifyingGlassIcon className="w-5 h-5 text-amber-600 shrink-0" />
                <span className="text-lg">
                  Look closely – some risks are hidden in plain sight!
                </span>
              </div>
            </div>
            <img
              src={shieldlogo}
              alt=""
              className="absolute top-0 right-0 w-30 h-30 object-contain"
              aria-hidden
            />
          </div>

          <hr className="border-amber-200" />

          {/* Your Goal */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Your Goal</h2>
            <p className="text-gray-700 leading-relaxed mb-3 text-lg">
              Find unsafe posts across all 5 privacy-risk categories and learn
              how to fix them before someone else can use that information.
            </p>
            <p className="font-bold text-gray-900 mb-2 text-xl">You win when:</p>
            <ul className="space-y-2 mb-4">
              {[
                "You finish reviewing the feed",
                "You find at least one unsafe post from each of the 5 categories",
                "You understand why each risk is unsafe",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <TiTick className="w-6 h-6 text-green-500 shrink-0 rounded-full bg-white" />
                  <span className="text-gray-700 text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-base">
              <strong>Note:</strong> Some categories may have more than one unsafe post. You need to find all 5 categories to win.
            </p>
          </div>

          <hr className="border-amber-200" />

          {/* How to Play */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How to Play</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1 text-lg">Unsafe posts:</p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Click directly on the part of the post that you think is a privacy risk. The danger could be anywhere in the photo (like a street sign, license plate, or school logo) or in the caption/text. Click on the exact spot where you see the risk.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-1 text-lg">Safe posts:</p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  If you think a post is safe and has no privacy risks, click the <strong>like button</strong> (heart icon) to show you&apos;ve checked it. That&apos;s the correct way to mark a safe post!
                </p>
              </div>
            </div>
          </div>

          <hr className="border-amber-200" />

          {/* The 5 Privacy Risks */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 text-center text-xl">
              The 5 Privacy Risks to Look For
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
              {RISK_CARDS.map((card) => (
                <div
                  key={card.num}
                  className="flex flex-col h-full min-h-[260px] rounded-xl overflow-hidden border border-amber-200 bg-white shadow-sm"
                >
                  <div
                    className={`${card.headerBg} shrink-0 min-h-14 flex items-center justify-center px-2 py-2 text-center`}
                  >
                    <p className="text-white font-semibold text-sm leading-tight">
                      {card.num} {card.title}
                    </p>
                  </div>
                  <div className="shrink-0 h-28 flex justify-center items-center bg-amber-50/50 py-2">
                    <img
                      src={card.image}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                      aria-hidden
                    />
                  </div>
                  <div className="flex-1 min-h-0" aria-hidden />
                  <div className="shrink-0 p-3 border-t border-amber-100">
                    <p className="text-gray-700 text-sm">{card.examples}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA + hint */}
          <div className="flex flex-col items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/game")}
              className="w-full max-w-sm py-3.5 rounded-2xl bg-green-500 text-white font-bold text-lg shadow-md border-2 border-amber-400 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
            >
              Start Investigating!
            </button>
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <MagnifyingGlassIcon className="w-4 h-4 text-amber-600 shrink-0" />
              <span>If a stranger saw this, what could they figure out?</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
