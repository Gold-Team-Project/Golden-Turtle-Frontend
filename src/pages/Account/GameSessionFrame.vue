<script setup>
import Pagination from '@/components/common/paging/Pagination.vue'

const props = defineProps({
  title: { type: String, default: 'GameSession' },
  sessions: { type: Array, default: () => [] },

  page: { type: Number, default: 1 },
  totalPages: { type: Number, default: 1 },
  maxButtons: { type: Number, default: 5 },
})

const emit = defineEmits(['change-page'])

const formatMoney = (v) => {
  if (v == null) return '-'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return num.toLocaleString()
}

const formatPercent = (v) => {
  if (v == null) return '-'
  const num = Number(v)
  if (Number.isNaN(num)) return String(v)
  return `${(num * 100).toFixed(0)}%`
}
</script>

<template>
  <div class="frame">
    <div class="content">
      <h1 class="title">{{ title }}</h1>

      <!-- 헤더 -->
      <div class="row header">
        <div class="cell">세션번호</div>
        <div class="cell">시작시간</div>
        <div class="cell">종료시간</div>
        <div class="cell right">종료금액</div>
        <div class="cell right">최종 수익률</div>
      </div>

      <!-- 데이터 -->
      <div
          v-for="s in sessions"
          :key="s.sessionId"
          class="row"
      >
        <div class="cell">{{ s.sessionId }}</div>
        <div class="cell">{{ s.startedAt }}</div>
        <div class="cell">{{ s.endedAt }}</div>
        <div class="cell right">{{ formatMoney(s.finalAsset) }}</div>
        <div class="cell right">{{ formatPercent(s.totalReturn) }}</div>
      </div>

      <!-- 빈 상태 -->
      <div v-if="sessions.length === 0" class="empty">
        조회된 세션이 없습니다.
      </div>
    </div>

    <!-- Pagination -->
    <Pagination
        :page="page"
        :total-pages="totalPages"
        @update:currentPage="(p) => emit('change-page', p)"
    />
  </div>
</template>

<style scoped>
/* 전체 프레임: 고정 width/height 제거 -> 반응형 */
.frame {
  width: 100%;
  max-width: 1088px;
  margin: 0 auto;
  padding: 24px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* 상단 영역 */
.content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 제목 */
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

/* 행 공통 스타일 */
.row {
  border: 3px solid #514626;
  border-radius: 5px;
  background: transparent;
  overflow: hidden;

  display: grid;
  grid-template-columns:
    minmax(70px, 0.7fr)   /* 세션번호 */
    minmax(140px, 1.4fr)  /* 시작시간 */
    minmax(140px, 1.4fr)  /* 종료시간 */
    minmax(110px, 1fr)    /* 종료금액 */
    minmax(90px, 0.8fr);  /* 수익률 */

  align-items: center;
  min-height: 64px;
}

/* 헤더 행 강조 */
.row.header {
  border-color: #6a5a34;
}

/* 셀 공통 스타일 (중복 제거 포인트) */
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

/* 숫자 우측 정렬 옵션 */
.cell.right {
  text-align: right;
  padding-right: 16px;
}

/* 빈 상태 */
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
    grid-template-columns:
      minmax(60px, 0.7fr)
      minmax(120px, 1.2fr)
      minmax(120px, 1.2fr)
      minmax(90px, 1fr)
      minmax(80px, 0.8fr);
  }

  .cell.right {
    padding-right: 10px;
  }
}

@media (max-width: 520px) {
  .row {
    grid-template-columns:
      0.6fr 1fr 1fr 0.9fr 0.7fr;
  }

  .cell {
    white-space: normal;
  }
}
</style>
