import React from 'react'
import detectivekid from '../assets/WelcomePage/detectivekid.png'
import welcomebanner from   '../assets/WelcomePage/welcomebanner.png'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useWelcomePage from '../../hooks/useWelcomePage.js'

function WelcomePage() {
  const {setUsername, handleStart} = useWelcomePage()


  return (
    <div className='bg-blue-200 h-screen w-full'>
        <div className='flex flex-col items-center justify-center h-screen'>
            <img src={welcomebanner} alt='Welcome, Digital Detective!' className='max-h-70 object-contain mx-auto' />
            <img src={detectivekid} alt='detectivekid' className='w-100 h-100 ' />
            <div className='flex flex-col items-center justify-center gap-4 px-15 py-5 bg-amber-100 rounded-lg'>
                <h2 className='text-2xl font-bold'>Enter Your Name</h2>
                <input onChange={(e) => setUsername(e.target.value)} type='text' placeholder='Enter your name' className='w-full p-2 rounded-md border-2 border-gray-300' />
                <button onClick={handleStart} className='bg-blue-500 text-white p-2 rounded-md'>Start</button>
            </div>
        </div>
    </div>
  )
}

export default WelcomePage
