<template>
  <div class="order-form-container">
    <div class="top-toggle-buttons">
      <button
          :class="['toggle-btn', { 'active-buy': currentMode === '매수' }]"
          @click="changeMode('매수')"
      >
        매수
      </button>
      <button
          :class="['toggle-btn', { 'active-sell': currentMode === '매도' }]"
          @click="changeMode('매도')"
      >
        매도
      </button>
    </div>

    <div class="input-fields-area">

      <div class="form-group">
        <label>주문 유형</label>
        <input type="text" value="시장가" disabled class="market-price-display" />
      </div>

      <div class="form-group">
        <label>수량</label>
        <input
            type="number"
            v-model.number="orderQuantity"
            min="1"
            placeholder="주문 수량 입력"
            class="quantity-input"
        />
      </div>

      <div class="form-group">
        <label>가격 ($)</label>
        <input
            type="text"
            :value="formattedAmount"
            disabled
            class="calculated-amount-display"
        />
      </div>

    </div>

    <button
        :class="['execute-btn', currentMode === '매수' ? 'buy-button' : 'sell-button']"
        @click="submitOrder"
    >
      {{ currentMode }}
    </button>
  </div>
</template>

<script setup>

import { ref, computed } from 'vue';



const props = defineProps({

  currentPrice: {

    type: Number,

    required: true,

    default: 0

  },

  stockSymbol: {

    type: String,

    required: false

  }

});



const currentMode = ref('매수'); // '매수' 또는 '매도'

const orderQuantity = ref(0); // 주문 수량



const calculatedAmount = computed(() => {

  const quantity = parseFloat(orderQuantity.value) || 0;

  // props로 받은 currentPrice 사용

  return quantity * props.currentPrice;

});



const formattedAmount = computed(() => {

  return calculatedAmount.value.toFixed(2).toLocaleString();

});



function changeMode(mode) {

  currentMode.value = mode;

}



function submitOrder() {

  if (orderQuantity.value <= 0) {

    alert('주문 수량은 0보다 커야 합니다.');

    return;

  }



  const orderDetails = {

    mode: currentMode.value,

    type: '시장가',

    quantity: orderQuantity.value,

    pricePerUnit: props.currentPrice, // props로 받은 currentPrice 사용

    totalAmount: calculatedAmount.value,

    stockSymbol: props.stockSymbol // props로 받은 stockSymbol 사용

  };



  console.log('--- 주문 제출 ---');

  console.log(orderDetails);

  alert(`${currentMode.value} 주문이 접수되었습니다.\n총 금액: ${formattedAmount.value}`);

  orderQuantity.value = 0;

}

</script>

<style scoped>
/* 기본적인 스타일링 */
.order-form-container {
  max-width: 18.6%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #5C4F2B;
  background-color: #2A2515; /* 이미지의 어두운 배경색 반영 */
  border-radius: 8px;
  color: #f0f0f0;
}

/* 상단 토글 버튼 스타일 */
.top-toggle-buttons {
  display: flex;
  margin-bottom: 20px;
  gap: 10px;
}
.toggle-btn {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-color: #555;
  color: #bbb;
  transition: background-color 0.3s;
}
.active-buy {
  background-color: #22C55E; /* 초록색 */
  color: white;
  border: 1px solid #22C55E;
}
.active-sell {
  background-color: #DC2626; /* 빨간색 */
  color: white;
  border: 1px solid #DC2626;
}

/* 입력 필드 그룹 스타일 */
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 5px;
}
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #5C4F2B;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #332C19; /* 이미지의 어두운 입력 필드 배경색 반영 */
  color: white;
  font-size: 16px;
}

/* 읽기 전용 필드 (Disabled) 스타일 */
.form-group input:disabled {
  background-color: #332C19; /* 비활성화된 필드는 더 어둡게 */
  color: #ddd;
  cursor: default;
}

/* 하단 실행 버튼 스타일 */
.execute-btn {
  width: 100%;
  padding: 15px 0;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
}
.buy-button {
  background-color: #22C55E; /* 매수 - 초록색 */
  color: white;
}
.sell-button {
  background-color: #DC2626; /* 매도 - 빨간색 */
  color: white;
}
</style>