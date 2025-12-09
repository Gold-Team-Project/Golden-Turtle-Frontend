<script setup>
import { ref, onMounted } from 'vue'
import GameSessionFrame from '@/components/GameSessionFrame.vue'
import { fetchGameSessionsByUserId } from '@/api/HistoryApi.js'

const page = ref(1)
const totalPages = ref(1)
const sessions = ref([])
const userId = 1

const loadSessions = async (newPage) => {
  try {
    const data = await fetchGameSessionsByUserId(userId, newPage)
    sessions.value = data.sessions
    totalPages.value = data.totalPages
    page.value = newPage
  } catch (error) {
    console.error('게임세션을 불러올수 없습니다:', error)
  }
}

const changePage = (p) => {
  loadSessions(p)
}

onMounted(() => {
  loadSessions(page.value)
})
</script>

<template>
  <GameSessionFrame
      :sessions="sessions"
      :page="page"
      :total-pages="totalPages"
      @change-page="changePage"
  />
</template>
