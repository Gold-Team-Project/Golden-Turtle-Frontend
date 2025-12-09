import api from './api.js'

export async function fetchGameSessionsByUserId(userId) {
    const res = await api.get(`/users/${userId}`)
    return res.data.data
}
