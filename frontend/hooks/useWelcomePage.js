import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../src/context/GameContext.jsx'

const useWelcomePage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const { createPlayerAndGo, playerError, setPlayerError } = useGame()

    const handleStart = async () => {
        await createPlayerAndGo(username, navigate)
    }

    return { username, setUsername, handleStart, playerError, setPlayerError }
}

export default useWelcomePage;