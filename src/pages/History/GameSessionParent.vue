<script setup>
import { ref } from 'vue'
import GameSessionFrame from '@/components/GameSessionFrame.vue'

const page = ref(1)
const totalPages = ref(10)

const sessions = ref([
  {
    sessionId: 1,
    startedAt: '2010-01-21 01:11',
    endedAt: '2010-01-21 01:22',
    finalAmount: 1000000,
    finalReturn: 0.5,
  },
])

const changePage = (p) => {
  page.value = p
  // 여기서 API 재호출하면 됨
}
</script>

<template>
  <GameSessionFrame
      :sessions="sessions"
      :page="page"
      :total-pages="totalPages"
      @change-page="changePage"
  />
</template>
