import React from 'react'

function ProgressBar({currentStep, totalSteps}) {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
        <p className='text-sm font-bold'>Found {currentStep} / {totalSteps} unsafe posts</p>
    <div className='w-full h-[10px] bg-gray-200 rounded-full'>
        
        <div className='h-full bg-blue-500 rounded-full' style={{width: `${(currentStep / totalSteps) * 100}%`}}></div>
    </div>
    </div>
  )
}

export default ProgressBar