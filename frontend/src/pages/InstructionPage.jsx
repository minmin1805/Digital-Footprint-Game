import React from 'react'
import { useNavigate } from 'react-router-dom'
export default function InstructionPage() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <div className='flex flex-col items-center justify-center w-[50%] mx-auto bg-amber-100 rounded-lg gap-4 p-10'>
        <div>
          <h2 className='text-2xl font-bold' >Mission Brief</h2>
          <p>Welcome to Digital Footprint Detective! Your mission is to review social media posts and spot anything that could put someone's privacy or safe at risk</p>
          <p>Every time you catch a risky detail, you earn points and learn how to post smarter.</p>
        </div>

        <div className='border border-gray-300 rounded-lg p-4'>
          <h2 className='text-2xl font-bold'>Your goal</h2>
          <p>Find unsafe post across 5 privacy-risk categories and learn how to fix them before someone else can use them</p>
          <p>You win when you finish the feed and identify the risks correctly</p>
        </div>

        <div>
          <h2>The 5 risks categories to look for</h2>
          <ul>
            <li>Location</li>
            <li>Personal Information</li>
            <li>Sensitive Information</li>
            <li>Financial Information</li>
            <li>Health Information</li>
          </ul>
        </div>

        <div className='border-1 border-gray-300 rounded-lg p-4'>
          <h2>Detectice checklist</h2>
          <ul>
            <li>What's in the background</li>
            <li>Who's in the photo</li>
            <li>What does the text reveals</li>
          </ul>
        </div>

        <button onClick={() => navigate('/game')} className='bg-blue-500 text-white p-2 rounded-md'>Start</button>
      </div>
    </div>
  )
}


// location tag 