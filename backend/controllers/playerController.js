import crypto from 'crypto'
import Player from '../models/Player.js'

export const createPlayer = async (req, res) => {
  try {
    const { username } = req.body

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        error: 'Username is required',
      })
    }

    const sessionId = crypto.randomUUID()

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
}

export const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params
    const { score, totalPossible, categoriesFound, playingTimeSeconds, completedAt } = req.body

    const update = {}
    if (typeof score === 'number') update.score = score
    if (typeof totalPossible === 'number') update.totalPossible = totalPossible
    if (Array.isArray(categoriesFound)) update.categoriesFound = categoriesFound
    if (typeof playingTimeSeconds === 'number') update.playingTimeSeconds = playingTimeSeconds
    if (completedAt) update.completedAt = new Date(completedAt)

    const updated = await Player.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    )

    if (!updated) {
      return res.status(404).json({ error: 'Player not found' })
    }

    res.json(updated)
  } catch (err) {
    console.error('updatePlayer error:', err)
    res.status(500).json({ error: 'Failed to update player' })
  }
}
