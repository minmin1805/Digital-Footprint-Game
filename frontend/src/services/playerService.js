import axios from 'axios'

const PLAYER_API_URL = '/api/players'

const createPlayer = async (username) => {
  const res = await axios.post(PLAYER_API_URL, { username })
  if (res.status === 201) {
    return res.data
  }
  throw new Error('Failed to create player')
}

const updatePlayer = async (playerId, data) => {
  const res = await axios.patch(`${PLAYER_API_URL}/${playerId}`, data)
  if (res.status >= 200 && res.status < 300) {
    return res.data
  }
  throw new Error('Failed to update player')
}

export { createPlayer, updatePlayer }