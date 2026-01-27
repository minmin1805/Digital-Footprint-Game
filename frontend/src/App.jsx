import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'



function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/instructions' element={<InstructionsPage />} />
        <Route path='/game' element={<GamePage />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
