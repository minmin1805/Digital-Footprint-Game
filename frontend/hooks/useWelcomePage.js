import { useState } from 'react'
import {createPlayer} from '../services/playerService'
import { useNavigate } from 'react-router-dom'

const useWelcomePage = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')

    const handleStart = async () => {
        if(username.trim()) {
            try {
                const createdPlayer = await createPlayer(username);
                navigate('/instructions');
            } catch (error) {
                console.error('Error creating player:', error)
                alert('Failed to create player. Please try again.')
            }
        }
        else {
            alert('Please enter a valid username')
        }
    }

    return {setUsername, handleStart }
}

export default useWelcomePage;