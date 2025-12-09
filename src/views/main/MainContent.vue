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

        <!-- Header -->
        <div class="ranking-table-header">
          <span>등수</span>
          <span>닉네임</span>
          <span>총 금액</span>
          <span>총 수익률</span>
        </div>

        <!-- Rows -->
        <div
            v-for="row in paginatedRows"
            :key="row.rank"
            class="ranking-row"
        >
          <span>{{ row.rankIcon }}</span>
          <span>{{ row.name }}</span>
          <span class="right">${{ formatNumber(row.totalAsset) }}</span>
          <span class="right">{{ row.returnRate }}%</span>
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
import { ref, computed } from "vue"
import Pagination from "@/components/paging/Pagination.vue"
import "@/assets/main/MainContent.css"

/* ---- 데이터 ---- */
const ranking = ref([
  { rank: 1, rankIcon: "🥇", name: "최지원", totalAsset: 11350000, returnRate: 11350 },
  { rank: 2, rankIcon: "🥈", name: "박규진", totalAsset: 11340000, returnRate: 11340 },
  { rank: 3, rankIcon: "🥉", name: "김진", totalAsset: 9340000, returnRate: 9340 },
  ...Array.from({ length: 50 }).map((_, i) => ({
    rank: i + 4,
    rankIcon: "🏅",
    name: `유저${i + 4}`,
    totalAsset: 1200000 + i * 10000,
    returnRate: 150 + i
  }))
])

/* 숫자 포맷 */
const formatNumber = (num) =>
    num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* PAGINATION */
const rowsPerPage = 5
const currentPage = ref(1)

const totalPages = computed(() =>
    Math.ceil(ranking.value.length / rowsPerPage)
)

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  return ranking.value.slice(start, start + rowsPerPage)
})
</script>
