import api from './api.js'

export async function fetchGameSessionsByUserId(userId) {
    const res = await api.get(`/gamesessions/${userId}`)
    return res.data.data
}
