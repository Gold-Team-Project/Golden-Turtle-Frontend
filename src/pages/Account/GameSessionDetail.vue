<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Pagination from '@/components/common/paging/Pagination.vue'
import { useAccountStore } from '@/stores/Account.js'
import { storeToRefs } from 'pinia'

const route = useRoute()
const accountStore = useAccountStore()

const { page, totalPages, trades } = storeToRefs(accountStore)

const formatMoney = (v) => {
  if (v == null) return '-'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return num.toLocaleString()
}

const loadPage = (newPage = 1) => {
  const sessionId = Number(route.params.sessionId)
  if (!sessionId) return

  accountStore.loadTrades(sessionId, newPage)
}

onMounted(() => {
  loadPage(1)
})
</script>

<template>
  <div class="frame">
    <div class="content">
      <h1 class="title">Trade History</h1>

      <!-- Header -->
      <div class="row header">
        <div class="cell">거래 ID</div>
        <div class="cell">종목 코드</div>
        <div class="cell">타입</div>
        <div class="cell right">가격</div>
        <div class="cell right">수량</div>
        <div class="cell">체결시간</div>
      </div>

      <!-- Data -->
      <div v-for="t in trades" :key="t.tradeId" class="row">
        <div class="cell">{{ t.tradeId }}</div>
        <div class="cell">{{ t.stockCode }}</div>
        <div class="cell">{{ t.tradeType }}</div>
        <div class="cell right">{{ formatMoney(t.price) }}</div>
        <div class="cell right">{{ t.quantity }}</div>
        <div class="cell">{{ t.conclusion_time }}</div>
      </div>

      <!-- Empty State -->
      <div v-if="!trades || trades.length === 0" class="empty">
        조회된 거래 내역이 없습니다.
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
        :current-page="page"
        :total-pages="totalPages"
        @update:currentPage="loadPage"
    />
  </div>
</template>

<style scoped>
/* 그대로 유지 */
.frame {
  width: 100%;
  max-width: 1088px;
  margin: 0 auto;
  padding: 24px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.title {
  margin: 0;
  height: auto;
  padding: 12px 0 6px;
  color: #ffbc00;
  font-family: "Inter-Black", Helvetica, sans-serif;
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 900;
  text-align: center;
}
.row {
  border: 3px solid #514626;
  border-radius: 5px;
  background: transparent;
  overflow: hidden;
  display: grid;
  grid-template-columns: 0.8fr 1fr 0.8fr 1fr 0.8fr 1.2fr;
  align-items: center;
  min-height: 64px;
}
.row.header {
  border-color: #6a5a34;
}
.cell {
  padding: 8px 10px;
  color: #ffffff;
  font-family: "Inter-Black", Helvetica, sans-serif;
  font-size: clamp(14px, 1.2vw, 20px);
  font-weight: 900;
  text-align: center;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell.right {
  text-align: right;
  padding-right: 16px;
}
.empty {
  border: 3px solid #514626;
  border-radius: 5px;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-family: "Inter-Black", Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 800;
}
@media (max-width: 768px) {
  .row {
    grid-template-columns: repeat(6, 1fr);
  }
}
@media (max-width: 520px) {
  .row {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
