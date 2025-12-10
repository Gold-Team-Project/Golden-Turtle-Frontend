import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchGameSessionsByUserId } from '@/api/AccountApi.js'

export const useAccountStore = defineStore('account', () => {
    const page = ref(1)
    const totalPages = ref(1)
    const sessions = ref([])

    const loadSessions = async (userId, newPage = 1) => {
        try {
            const data = await fetchGameSessionsByUserId(userId, newPage)

            sessions.value = data.gameSessions ?? []
            totalPages.value = data.pagination?.totalPages ?? 1
            page.value = data.pagination?.currentPage ?? newPage
        } catch (error) {
            console.error('게임세션을 불러올수 없습니다:', error)
        }
    }

    return {
        page,
        totalPages,
        sessions,
        loadSessions,
    }
})
