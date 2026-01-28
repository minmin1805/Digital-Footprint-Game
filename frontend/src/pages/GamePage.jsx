import React from 'react'
import ProgressBar from '../components/ProgressBar'
import FriendSection from '../components/FriendSection'
import MenuBar from '../components/MenuBar'
import MessageBar from '../components/MessageBar'

function GamePage() {
  return (
    <div className='flex flex-col items-center h-screen w-[55%] mx-auto bg-blue-200'>
      
      {/* banner and progress bar */}
      <div className='flex flex-col items-center justify-center p-4 gap-4 bg-yellow-300 rounded-xl mt-3'>
        <h1 className='text-3xl font-bold text-center text-blue-500'>Digital footprint detective</h1>
        <ProgressBar currentStep={2} totalSteps={5} />
      </div>

      <div className='w-full h-[1px] bg-gray-900 my-4'></div>

      {/* friend section */}
      <div>
      <FriendSection />
      </div>

    <div className='flex items-center justify-between w-full p-5 mt-25'>
      {/* menu bar on left */}
      <div>
        <MenuBar />
      </div>

      {/* messagebar on right */}
      <div>
        <MessageBar />
      </div>
      </div>
    </div>
  )
}

export default GamePage
