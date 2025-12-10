<template>
  <Header />
  <div class="admin-page-container">

    <div class="content-header">
      <h2 class="page-title">종목 추가</h2>
      <button class="add-stock-btn" @click="openAddModal">
        종목 추가
      </button>
    </div>

    <div class="stock-list-wrapper">
      <table class="stock-table">
        <thead>
        <tr>
          <th
              v-for="header in headers"
              :key="header.key"
              @click="sortBy(header.key)"
              :class="{ 'active-sort': sortKey === header.key }"
          >
            {{ header.label }}
            <span class="sort-icon">
              {{ sortKey === header.key ? (sortOrder === 1 ? '▲' : '▼') : '⮁' }}
            </span>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in displayedStocks" :key="index">
          <td>{{ item.code }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.market }}</td>
          <td>{{ item.date }}</td>
          <td>{{ item.isOperate ? '운영' : '미운영' }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span class="info-text">총 {{ stockList.length }}개 종목</span>
      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
      </div>
    </div>
  </div>
  <AddStockModal
      :isOpen="isModalOpen"
      :existingStocks="stockList"
      @update:isOpen="isModalOpen = $event"
      @add-stock="handleStockAdded"
  />
</template>

<script>
import Header from "@/components/layout/header/Header.vue";
import AddStockModal from "@/components/modal/AddStockModal.vue";



export default {
  name: 'AdminStockManager',
  components: {Header, AddStockModal},
  data() {
    return {
      isModalOpen: false,
      // 테이블 헤더 정보 (key는 데이터 객체의 속성 이름과 일치해야 함)
      headers: [
        { key: 'code', label: '종목 코드' },
        { key: 'name', label: '종목 이름' },
        { key: 'market', label: '종목 시장' },
        { key: 'date', label: '종목 등록일자' },
        { key: 'isOperate', label: '운영 여부' }, // data의 isOperate와 일치시킴
      ],
      stockList: [
        // 예시 데이터 (8개 초과하여 페이지네이션 테스트)
        { code: 'BTC', name: '비트코인', market: '???', date: '2025-12-04', isOperate: true },
        { code: 'ETH', name: '이더리움', market: '???', date: '2025-12-01', isOperate: true },
        { code: 'XRP', name: '리플', market: '???', date: '2025-11-20', isOperate: false },
        { code: 'ADA', name: '에이다', market: '???', date: '2025-12-10', isOperate: true },
        { code: 'DOGE', name: '도지코인', market: '???', date: '2025-11-05', isOperate: true },
        { code: 'SOL', name: '솔라나', market: '???', date: '2025-10-15', isOperate: false },
        { code: 'LTC', name: '라이트코인', market: '???', date: '2025-12-08', isOperate: true },
        { code: 'DOT', name: '폴카닷', market: '???', date: '2025-11-25', isOperate: true },
        // 2페이지 항목
        { code: 'AVAX', name: '아발란체', market: '???', date: '2025-12-02', isOperate: true },
        { code: 'LINK', name: '체인링크', market: '???', date: '2025-11-15', isOperate: false },
      ],
      //️ 정렬 및 페이지네이션 상태 추가
      sortKey: 'date',
      sortOrder: -1, // -1: 내림차순, 1: 오름차순 (기본: 최신 등록일 기준 내림차순)
      itemsPerPage: 8, // 한 페이지에 8개 항목 표시
      currentPage: 1,
    };
  },
  computed: {
    // 1. 정렬된 전체 목록을 반환
    sortedStocks() {
      let sortedList = [...this.stockList];
      const key = this.sortKey;
      const order = this.sortOrder;

      if (key) {
        sortedList.sort((a, b) => {
          const aVal = a[key];
          const bVal = b[key];

          // Boolean 타입('운영 여부') 정렬 처리
          if (typeof aVal === 'boolean') {
            if (aVal === bVal) return 0;
            // true(운영)를 위로 올리려면 -1, 내리려면 1
            return aVal ? -1 * order : 1 * order;
          }

          if (aVal < bVal) return -1 * order;
          if (aVal > bVal) return 1 * order;
          return 0;
        });
      }
      return sortedList;
    },
    // 2. 현재 페이지에 표시될 8개 항목만 반환 (페이지네이션)
    displayedStocks() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedStocks.slice(start, end);
    },
    // 3. 총 페이지 수 계산
    totalPages() {
      return Math.ceil(this.stockList.length / this.itemsPerPage);
    }
  },
  methods: {
    // openAddModal 수정
    openAddModal() {
      this.isModalOpen = true; // 모달을 열도록 상태 변경
    },

    // 모달에서 종목 추가 요청을 받을 메서드 (이전에 안내드렸던 내용)
    handleStockAdded(newStock) {
      this.stockList.push(newStock);
      console.log('New stock added:', newStock.name);
    },
    //  정렬 기준 변경 기능 (sortBy)
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder * -1; // 현재 기준이면 순서 반전
      } else {
        this.sortKey = key;
        this.sortOrder = 1; // 새로운 기준이면 오름차순으로 시작
      }
      this.currentPage = 1; // 정렬 기준 변경 시 1페이지로 이동
    },
    //  페이지 변경 기능 (changePage)
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
};
</script>

<style scoped>
/*
 * =======================================================
 * 1. 기본 레이아웃 및 테마 설정
 * =======================================================
 */
.admin-page-container {
  padding: 30px 40px;
  background-color: #3a3528;
  color: #ffffff;
  min-height: 100vh;
}

/* 헤더와 버튼 영역 */
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-shrink: 0;
  width: 75.7%;
  max-width: 1090px;
  margin-left: auto;
  margin-right: auto;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

/* 종목 추가 버튼 */
.add-stock-btn {
  background-color: #ECB20F;
  color: #542212;
  border: none;
  padding: 10px 30px;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-stock-btn:hover {
  background-color: #F2CA57;
}

/*
 * =======================================================
 * 2. 테이블 영역 및 스크롤 관리
 * =======================================================
 */

.stock-list-wrapper {
  width: 100%;
  max-width: 1090px;
  height: 470px;
  overflow-y: auto;
  border: 3px solid #5C4F2B;
  border-radius: 10px;
  background-color: #2A2515;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  margin: 0 auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
}

/* 테이블 헤더 스타일 */
.stock-table thead {
  background-color: #4a4437;
  color: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 정렬 기능 추가: 헤더에 커서와 활성화 스타일 적용 */
.stock-table th {
  padding: 15px 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #504a3d;
  cursor: pointer; /* 클릭 가능 표시 */

}

.stock-table th.active-sort {
  background-color: #403b30; /* 현재 정렬 기준 강조 */
}

.sort-icon {
  margin-left: 8px;
  font-size: 10px;
  opacity: 0.8;
}

/* 테이블 바디 스타일 */
.stock-table tbody tr {
  border-bottom: 1px solid #5C4F2B;
  transition: background-color 0.1s;
}

.stock-table tbody tr:last-child {
  border-bottom: none;
}

.stock-table tbody tr:hover {
  background-color: #403b30;
}

.stock-table td {
  padding: 15px 12px;
  font-size: 14px;
}

/*
 * =======================================================
 * 3. 테이블 하단 푸터 (페이지네이션)
 * =======================================================
 */
.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  max-width: 1090px;
  margin: 15px auto 0 auto;

}

.pagination button {
  background: #504a3d;
  border: none;
  color: white;
  padding: 5px 10px;
  margin: 0 3px;
  border-radius: 4px;
  cursor: pointer;
}

/* 페이지네이션 버튼 비활성화 상태 추가 */
.pagination button:disabled {
  opacity: 0.5;
  cursor: default;
}

.sort-icon {
  margin-left: 8px;
  font-size: 15px;
  opacity: 0.8; /* 기본 투명도 */
  transition: opacity 0.2s;
}

/* 정렬이 활성화된 컬럼의 아이콘은 투명도 1로 강조 */
.stock-table th.active-sort .sort-icon {
  opacity: 1;
}

/* 정렬이 활성화되지 않은 컬럼의 아이콘은 투명도 0.4 정도로 낮춤 */
.stock-table th:not(.active-sort) .sort-icon {
  opacity: 0.4;
}
</style>