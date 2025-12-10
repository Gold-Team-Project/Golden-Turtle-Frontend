<template>
  <div class="gt-box">
    <h1>Stock Detail: {{ symbol }}</h1>
    <div class="chart-section">
      <StockCandleChart :symbol="symbol" />
    </div>
    <p>This page will display detailed information for {{ symbol }}.</p>
    <!-- Other stock details will go here -->
  </div>
</template>

<script setup>
import StockCandleChart from '@/components/stock/StockCandleChart.vue';
import { defineProps } from 'vue';
import '@/assets/stock/StockList.css'; // Import the common box styles

const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
/* Most styles are now coming from the imported StockList.css via 'gt-box' */
/* We can keep specific styles or override them here */

h1 {
  color: #FFD700; /* Golden color for titles */
  margin-bottom: 20px;
  text-align: center;
}

.chart-section {
  width: 100%;
  max-width: 1200px;
  height: 500px;
  margin: 0 auto 30px auto;
  /* The background and border styles will be inherited or can be set here if needed */
}

p {
  text-align: center;
  color: #d1d4dc;
}
</style>