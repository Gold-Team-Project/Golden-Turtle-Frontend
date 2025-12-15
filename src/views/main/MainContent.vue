<template>
  <div class="main-wrapper">
    <div class="content-center">

      <!-- 타이틀 -->
      <div class="main-title">
        <p>You Have 10 Minutes.</p>
        <p>Maximize Your Returns.</p>
      </div>

      <!-- Ranking Title -->
      <h2 class="ranking-section-title">Ranking</h2>

      <!-- Ranking Table -->
      <div class="ranking-table">
        <div class="ranking-table-header">
          <span>등수</span>
          <span>닉네임</span>
          <span>총 금액</span>
          <span>총 수익률</span>
        </div>

        <div
            v-for="row in ranking"
            :key="row.rank"
            class="ranking-row"
        >
          <span>
            <template v-if="row.rank === 1">🥇</template>
            <template v-else-if="row.rank === 2">🥈</template>
            <template v-else-if="row.rank === 3">🥉</template>
            <template v-else>{{ row.rank }}</template>
          </span>
          <span>{{ row.nickname }}</span>
          <span class="right">${{ formatNumber(row.totalAsset) }}</span>
          <span class="right">{{ row.totalReturn }}%</span>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
          v-model:currentPage="currentPage"
          :total-pages="totalPages"
      />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import Pagination from "@/components/common/paging/Pagination.vue"
import "@/assets/main/MainContent.css"
import api from "@/api/axios"

/* ---- 랭킹 데이터 ---- */
const ranking = ref([])

/* ---- Pagination ---- */
const rowsPerPage = 7
const currentPage = ref(1)

/**
 * ⚠️ 서버에서 totalPages를 내려주지 않으므로
 * 임시로 고정값 사용 (백엔드 수정 전까지)
 */
const totalPages = ref(10)

/* 숫자 포맷 */
const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

/* ---- API 호출 ---- */
const fetchRanking = async () => {
  try {
    const res = await api.get("/api/v1/ranking", {
      params: {
        page: currentPage.value,
        size: rowsPerPage
      }
    })

    ranking.value = res.data.data
    console.log("랭킹 데이터:", ranking.value)
  } catch (err) {
    console.error("랭킹 조회 실패:", err)
  }
}

/* 페이지 변경 시 서버 재요청 */
watch(currentPage, () => {
  fetchRanking()
})

onMounted(() => {
  fetchRanking()
})
</script>
