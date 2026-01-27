import axios from 'axios'


const PLAYER_API_URL = '/api/players'

const createPlayer = async (username) => {
    const res = await axios.post(PLAYER_API_URL, { username });

    if(res.status === 201) {
        return res.data;
    }
    else {
        throw new Error('Failed to create player')
    }

    return res.data;
}

export { createPlayer };