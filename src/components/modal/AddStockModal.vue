<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">

    <div class="stock-add-modal">

      <div class="modal-header">
        <h3 class="modal-title">종목 추가</h3>
        <button class="close-btn" @click="closeModal">X</button>
      </div>

      <div class="modal-body">

        <div class="search-container">
          <input
              type="text"
              v-model="tickerCode"
              @keyup.enter="searchStock"
              placeholder="종목코드(티커) 검색"
              class="ticker-input"
          >
          <button class="search-btn" @click="searchStock">
            <span class="search-icon">🔍</span>
          </button>
        </div>

        <div v-if="searchResult.name" class="result-display">
          <p><strong>조회된 종목:</strong> {{ searchResult.name }} ({{ searchResult.code }})</p>
          <p v-if="isDuplicate" class="warning-text">이미 목록에 존재하는 종목입니다.</p>
        </div>
        <div v-else-if="searchAttempted && !searchResult.name" class="result-display">
          <p class="warning-text">검색 결과가 없습니다.</p>
        </div>

        <button
            :disabled="!searchResult.name || isDuplicate"
            class="add-stock-action-btn"
            @click="addStockToManager"
        >
          종목 추가
        </button>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminStockAddModal',
  props: {
    isOpen: { /* ... */ },
    existingStocks: { /* ... */ }
  },
  data() {
    return {
      tickerCode: '',
      searchResult: {
        code: '',
        name: '',
        market: 'CRYPTO',
        date: ''
      },
      searchAttempted: false,
    };
  },
  computed: {
    isDuplicate() {
      if (!this.searchResult.code) return false;
      return this.existingStocks.some(stock => stock.code === this.searchResult.code);
    }
  },
  methods: {
    // 1. 모달 닫기
    closeModal() {
      // 부모 컴포넌트에 'isOpen' 상태를 false로 업데이트하라고 알림
      this.$emit('update:isOpen', false);
      this.resetState(); // 폼 입력 내용 및 검색 결과 초기화
    },

    // 2. 모달 상태 초기화
    resetState() {
      this.tickerCode = '';
      this.searchResult = { code: '', name: '', market: 'CRYPTO', date: '' };
      this.searchAttempted = false;
    },

    // 3. 종목 검색 (더미 로직)
    async searchStock() {
      if (!this.tickerCode) return;
      this.searchAttempted = true;
      this.searchResult = { code: '', name: '', market: 'CRYPTO', date: '' };

      const code = this.tickerCode.toUpperCase().trim();

      let dummyData = null;
      if (code === 'BTC') {
        dummyData = { name: '비트코인', code: 'BTC' };
      } else if (code === 'ETH') {
        dummyData = { name: '이더리움', code: 'ETH' };
      }

      if (dummyData) {
        this.searchResult = {
          code: dummyData.code,
          name: dummyData.name,
          market: '???',
          date: new Date().toISOString().split('T')[0],
          isOperate: true,
        };
      }
    },

    // 4. 종목 추가 후 모달 닫기
    addStockToManager() {
      if (!this.searchResult.code || this.isDuplicate) return;

      this.$emit('add-stock', this.searchResult);
      this.closeModal(); // 추가 완료 후 모달 닫기
    }
  },
  watch: {
    // 모달이 열릴 때마다 검색 상태 초기화
    isOpen(newVal) {
      if (newVal) {
        this.resetState();
      }
    }
  }
};
</script>

<style scoped>
/*
 * =======================================================
 * 1. 모달 오버레이 및 중앙 정렬
 * =======================================================
 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.stock-add-modal {
  width: 500px;
  height: 280px;
  background-color: #2d291f;
  border-radius: 12px;
  border: 2px solid #5C4F2B;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  color: #ffffff;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

/*
 * =======================================================
 * 2. 모달 헤더 및 본문
 * =======================================================
 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

}
/* ... (modal-title, close-btn 스타일 유지) ... */

.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding-top: 5px;
}
.close-btn {
  /* 현재 흰색 배경으로 보이는 X 버튼을 투명 또는 테마색으로 변경 */
  background: none; /* 배경 제거 */
  border: none;
  color: #ECB20F; /* X 글자색을 테마색(노란색 계열)으로 변경 */
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ffffff; /* 마우스 오버 시 흰색으로 변경 */
}

/*
 * =======================================================
 * 3. 검색 입력 및 버튼
 * =======================================================
 */
.search-container {
  display: flex;
  width: 80%;
  border: 1px solid #504a3d;
  border-radius: 10px;
  background-color: #4a4437;
  overflow: hidden;
}

.ticker-input {
  padding: 8px 15px;
  flex-grow: 1;
  border: none;
  background-color: transparent;
  color: white;
  font-size: 16px;
  outline: none;
}
.ticker-input::placeholder {
  color: #a0a0a0; /* 회색 계열로 변경하여 가독성 확보 */
  opacity: 1; /* 일부 브라우저에서 투명도가 적용되는 것을 방지 */
}
.ticker-input::placeholder {
  color: #a0a0a0; /* 회색 계열로 변경하여 가독성 확보 */
  opacity: 1; /* 일부 브라우저에서 투명도가 적용되는 것을 방지 */
}

/* 검색 버튼 (돋보기 배경) 수정 */
.search-btn {
  /* 현재 흰색 배경으로 보이는 돋보기를 테마색으로 변경 */
  background-color: #ECB20F; /* 어두운 갈색/회색 계열 */
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-btn:hover {
  background-color: #635b4a; /* 마우스 오버 시 약간 밝게 */
}

.search-icon {
  font-size: 14px;
}

/*
 * =======================================================
 * 4. 결과 및 추가 버튼
 * =======================================================
 */
.result-display {
  text-align: center;
  font-size: 15px;
  color: #a0a0a0;
  padding: 5px 0;
}

.warning-text {
  color: #ff8a80;
  font-weight: bold;
  margin: 3px 0 0 0;
}

.add-stock-action-btn {
  background-color: #ECB20F;
  color: #2d291f;
  border: none;
  padding: 10px 30px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  width: 80%;
  margin-top: 10px;
  transition: background-color 0.2s, opacity 0.2s;
}

.add-stock-action-btn:hover:not(:disabled) {
  background-color: #F2CA57;
}

.add-stock-action-btn:disabled {
  background-color: #706b60;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>