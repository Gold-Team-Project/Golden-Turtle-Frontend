<script setup>
import { onMounted } from 'vue'
import GameSessionFrame from '@/pages/Account/GameSessionFrame.vue'
import { useAccountStore } from '@/stores/Account.js'
import { storeToRefs } from 'pinia'

const accountStore = useAccountStore()

const {
  page,
  totalPages,
  sessions
} = storeToRefs(accountStore)

const changePage = (p) => {
  accountStore.loadSessions(p)
}

onMounted(() => {
  accountStore.loadSessions(page.value)
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
