import crypto from 'crypto'
import Player from '../models/Player.js'



export const createPlayer = async (req, res) => {
    try {
    const {username} = req.body;

    if(!username || typeof username !== 'string') {
        return res.status(400).json({
            error: 'Username is required'
        })
    }

    const sessionId = crypto.randomUUID();

    const createdPlayer = await Player.create({
        sessionId,
        playerName: username.trim(),
    })

    res.status(201).json({
        id: createdPlayer._id,
        sessionId: createdPlayer.sessionId,
        playerName: createdPlayer.playerName,
    })
} catch (err) {
    console.error('createPlayer error:', err)
    res.status(500).json({ error: 'Failed to create player' })
}
};