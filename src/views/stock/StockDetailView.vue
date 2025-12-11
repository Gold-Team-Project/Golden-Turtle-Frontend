<template>
  <div class="stock-detail-container">
    <div class="flex-container">
      <div class="left-column">
        <div class="gt-box gt-box-1"><StockCandleChart :symbol="symbol"/></div>
        <div class="gt-box gt-box-2">
          <div class="stock-info-box">
            <div class="info-cell">
              <div class="label">고가</div>
              <div class="value">{{ stockData?.h }}</div>
            </div>
            <div class="info-cell">
              <div class="label">저가</div>
              <div class="value">{{ stockData?.l }}</div>
            </div>
            <div class="info-cell">
              <div class="label">시초가(당일)</div>
              <div class="value">{{ stockData?.o }}</div>
            </div>
            <div class="info-cell">
              <div class="label">전일 종가</div>
              <div class="value">{{ stockData?.pc }}</div>
            </div>
            <div class="info-cell">
              <div class="label">전일 대비</div>
              <div class="value">{{ stockData ? (stockData.o - stockData.pc).toFixed(2) : '' }}</div>
            </div>
            <div class="info-cell">
              <div class="label">증감 비율</div>
              <div class="value">{{ stockData?.dp.toFixed(2) }}%</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-column">
        <div class="gt-box gt-box-3">
          <div class="account-info-box">
            <div class="info-cell-vertical">
              <div class="label">총자산</div>
              <div class="value">000,000,000.00</div>
            </div>
            <div class="info-cell-vertical">
              <div class="label">평가 손익</div>
              <div class="value">000,000.00</div>
            </div>
            <div class="info-cell-vertical">
              <div class="label">수익률</div>
              <div class="value">0.00%</div>
            </div>
          </div>
        </div>
        <div class="gt-box gt-box-4"><BuySell/></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import StockCandleChart from '@/components/stock/StockCandleChart.vue';
import BuySell from '@/components/trade/BuySell.vue';
import { getStockDetail } from '@/api/StockApi.js';

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
});

const stockData = ref(null);

onMounted(async () => {
  try {
    const fullSymbol = props.symbol; // e.g., BINANCE:XRPUSDT
    const parts = fullSymbol.split(':');
    let parsedSymbol = '';

    if (parts.length > 1) {
      parsedSymbol = parts[1]; // e.g., XRPUSDT
      // Remove USDT or USDC from the end
      if (parsedSymbol.endsWith('USDT')) {
        parsedSymbol = parsedSymbol.slice(0, -4);
      } else if (parsedSymbol.endsWith('USDC')) {
        parsedSymbol = parsedSymbol.slice(0, -4);
      }
    } else {
      parsedSymbol = fullSymbol; // Fallback if no market prefix
    }

    const response = await getStockDetail(parsedSymbol);
    if (response.success) {
      stockData.value = response.data;
    }
  } catch (error) {
    console.error('Failed to fetch stock detail:', error);
  }
});
</script>

<style scoped>
.stock-detail-container {
    padding: 1rem;
    height: calc(100vh - 80px); /* Adjust 80px based on header height */
    box-sizing: border-box;
}

.flex-container {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 1rem;
}

.left-column {
  display: flex;
  flex-direction: column;
  flex-basis: 80%; /* Corrected width for left column */
  gap: 1rem;
  margin-top: -30px;
  margin-left: -30px;
}

.right-column {
  display: flex;
  flex-direction: column;
  flex-basis: 20%; /* Corrected width for right column */
  gap: 1rem;
  margin-top: -30px;
}

.gt-box {
  background-color: #2b2417;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 1.5rem;
  box-sizing: border-box;
  flex-grow: 1;
  overflow: auto; /* Handle content overflow */
}

.gt-box-4 { /* Specific style for the BuySell box */
  height: 400px; /* Retaining user's set height */
  flex-grow: 0; /* Prevent it from growing */
  display: flex; /* Enable flexbox for centering */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
}

/* Styles for gt-box-2 content */
.stock-info-box {
  display: flex; /* Use flexbox for horizontal layout */
  justify-content: space-between; /* Distribute cells evenly */
  align-items: center; /* Vertically align cells */
  height: 100%;
  gap: 0.5rem; /* Add a small gap between cells */
}

.info-cell {
  flex: 1; /* Allow cells to grow and shrink equally */
  height: 80%; /* Make cells take most of the container height */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically inside the cell */
  align-items: center; /* Center content horizontally inside the cell */
  background-color: #3a3528; /* A slightly different background */
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid, #5C4F2B;
}

.info-cell .label {
  font-size: 0.8rem;
  color: #a0937d; /* Lighter color for the label */
  margin-bottom: 0.5rem;
}

.info-cell .value {
  font-size: 1rem;
  font-weight: bold;
  color: #dcd2bb;
}

/* Styles for gt-box-3 content */
.account-info-box {
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  height: 100%;
  justify-content: space-around; /* Distribute cells evenly */
  gap: 0.5rem; /* Add a small gap between cells */
}

.info-cell-vertical {
  flex: 1; /* Allow cells to grow and shrink equally */
  height: auto; /* Let content define height within flex item */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center content vertically inside the cell */
  align-items: center; /* Center content horizontally inside the cell */
  background-color: #3a3528; /* A slightly different background */
  border-radius: 8px;
  padding: 0.5rem;
  text-align: center;
  border: 1px solid, #5C4F2B;
}

.info-cell-vertical .label {
  font-size: 0.8rem;
  color: #a0937d; /* Lighter color for the label */
  margin-bottom: 0.5rem;
}

.info-cell-vertical .value {
  font-size: 1rem;
  font-weight: bold;
  color: #dcd2bb;
}
</style>