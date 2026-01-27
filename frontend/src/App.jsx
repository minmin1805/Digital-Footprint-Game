import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <h1 className='text-3xl font-bold text-amber-300 flex justify-center items-center h-screen'>Hello world</h1>
    </>
  )
}

export default App
