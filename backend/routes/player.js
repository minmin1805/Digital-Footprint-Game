import express from 'express'
import { createPlayer, updatePlayer } from '../controllers/playerController.js'

const router = express.Router()

// Mounted at /api/players, so POST /api/players creates a player
router.post('/', createPlayer)
router.patch('/:id', updatePlayer)

export default router