<template>
  <div class="frame">
    <div class="div">
      <div class="text-wrapper-2">GameSession</div>
      <div class="navbar">
        <div class="text-wrapper-3">세션번호</div>
        <div class="text-wrapper-4">시작시간</div>
        <div class="text-wrapper-5">종료시간</div>
        <div class="text-wrapper-6">종료금액</div>
        <div class="text-wrapper-7">최종 수익률</div>
      </div>
      <div class="navbar">
        <div class="text-wrapper-8">1</div>
        <div class="text-wrapper-9">2010-01-21-01.11</div>
        <div class="text-wrapper-10">2010-01-21-01.22</div>
        <div class="text-wrapper-11">1,000,000</div>
        <div class="text-wrapper-12">50%</div>
      </div>
    </div>
    <Pagination />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import TradeHistoryTable from '@/components/trade/TradeHistoryTable.vue'
import { tradeApi } from '@/api/tradeApi'

const route = useRoute()
const sessionId = ref(route.params.sessionId)

const trades = ref([])
const loading = ref(false)

const fetchTrades = async () => {
  loading.value = true
  try {
    const res = await tradeApi.listBySession(sessionId.value)
    trades.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(fetchTrades)

watch(
    () => route.params.sessionId,
    (newId) => {
      sessionId.value = newId
      fetchTrades()
    }
)
</script>

<style>
.frame {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 862px;
  justify-content: space-between;
  position: relative;
  width: 1088px;
}

.frame .div {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 30px;
  position: relative;
  width: 100%;
}

.frame .text-wrapper-2 {
  align-items: center;
  align-self: stretch;
  color: #ffbc00;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 40px;
  font-weight: 900;
  height: 92px;
  justify-content: center;
  letter-spacing: 0;
  line-height: 70px;
  margin-top: -1.00px;
  position: relative;
}

.frame .navbar {
  align-self: stretch;
  border: 3px solid;
  border-color: #514626;
  border-radius: 5px;
  height: 70px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.frame .text-wrapper-3 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 30px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-4 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 237px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-5 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 496px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-6 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 729px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-7 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 931px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-8 {
  align-items: center;
  bottom: 0;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 58px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  white-space: nowrap;
}

.frame .text-wrapper-9 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 181px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-10 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 445px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-11 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 719px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .text-wrapper-12 {
  align-items: center;
  color: #ffffff;
  display: flex;
  font-family: "Inter-Black", Helvetica;
  font-size: 20px;
  font-weight: 900;
  height: 70px;
  justify-content: center;
  left: 966px;
  letter-spacing: 0;
  line-height: 70px;
  position: absolute;
  text-align: center;
  top: 0;
  white-space: nowrap;
}

.frame .pagination-instance {
  left: unset !important;
  top: unset !important;
}
</style>