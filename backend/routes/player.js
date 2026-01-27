import express from 'express'
import { createPlayer } from '../controllers/playerController.js'

const router = express.Router()

// Mounted at /api/players, so POST /api/players creates a player
router.post('/', createPlayer)

export default router