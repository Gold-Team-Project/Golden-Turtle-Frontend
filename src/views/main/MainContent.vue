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
import {ref, computed, onMounted, watch} from "vue"
import Pagination from "@/components/common/paging/Pagination.vue"
import "@/assets/main/MainContent.css"
import api from "@/api/axios"

/* ---- 랭킹 데이터 ---- */
const ranking = ref([])

/* ---- Pagination ---- */
const rowsPerPage = 7 // 서버 size와 맞추면 좋음
const currentPage = ref(1)
const totalPages = ref(1)

/* 숫자 포맷 */
const formatNumber = (num) =>
    num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ---- API 호출 함수 ---- */
const fetchRanking = async () => {
  try {
    const res = await api.get("/api/v1/ranking", {
      params: {
        page: currentPage.value,
        size: rowsPerPage
      }
    });

    const data = res.data.data; // ApiResponse의 data 리스트
    ranking.value = data;

    // 총 페이지수를 서버에서 내려주지 않으므로 임시 계산 (실제로는 totalCount 필요)
    totalPages.value = Math.ceil(data.length / rowsPerPage);

    console.log("랭킹 데이터:", data);
  } catch (err) {
    console.error("랭킹 조회 실패:", err);
  }
};

/* 페이지 바뀔 때마다 새 데이터 가져오기 */
watch(currentPage, () => {
  fetchRanking();
});

/* 첫 로딩 시 API 호출 */
onMounted(() => {
  fetchRanking();
});

/* 현재 페이지 데이터 (서버 페이징 안 쓰는 경우) */
const paginatedRows = computed(() => {
  return ranking.value; // 서버에서 이미 페이지로 잘라서 내려옴
});
</script>
