import React from 'react'

function ProgressBar({ currentStep, totalSteps, label = 'categories' }) {
  return (
    <div className='flex flex-col items-center justify-center gap-2 max-[430px]:gap-1'>
        <p className='text-sm max-[430px]:text-xs font-bold'>Found {currentStep} / {totalSteps} {label}</p>
    <div className='w-full h-[10px] max-[430px]:h-[6px] bg-gray-200 rounded-full'>
        
        <div className='h-full bg-blue-500 rounded-full' style={{width: `${(currentStep / totalSteps) * 100}%`}}></div>
    </div>
    </div>
  )
}

export default ProgressBar