import api from './api.js'

export async function fetchGameSessionsByUserId(userId, page = 1, size = 10) {
    const res = await api.get('/gamesessions', {
        params: { userId, page, size },
    })
    console.log(res.data.data)
    return res.data.data
}

