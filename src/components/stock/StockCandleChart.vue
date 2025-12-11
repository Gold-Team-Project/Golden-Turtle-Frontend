<template>
  <div class="stock-chart-wrapper">
    <div class="chart-header">
      <h2 class="stock-symbol">{{ symbol }}</h2>
      <h3 class="current-price">${{ currentPrice.toFixed(2) }}</h3>
      <p class="price-change" :class="{ 'positive': priceChange >= 0, 'negative': priceChange < 0 }">
        {{ priceChangeFormatted }}
      </p>
    </div>
    <div class="chart-container" ref="chartContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { createChart, CandlestickSeries, HistogramSeries, PriceScaleMode } from 'lightweight-charts';
import { useStockStore } from '@/stores/stock'; // Import Pinia store

// --- Props ---
const props = defineProps({
  symbol: {
    type: String,
    required: true,
  },
});

// --- Pinia Store ---
const stockStore = useStockStore();

// --- Chart-related reactive variables ---
const chartContainer = ref(null);
let chart = null;
let candleSeries = null;
let volumeSeries = null;
const OHLCV_data = {};
const INTERVAL_SECONDS = 5; // 1-minute interval

// --- Price display ---
const openingPrice = ref(170.00); // Dummy opening price
const currentPrice = ref(0);

const priceChange = computed(() => {
  if (openingPrice.value === 0) return 0;
  return ((currentPrice.value - openingPrice.value) / openingPrice.value) * 100;
});

const priceChangeFormatted = computed(() => {
  const sign = priceChange.value >= 0 ? '+' : '';
  return `${sign}${priceChange.value.toFixed(2)}%`;
});

// --- Chart Initialization ---
onMounted(() => {
  if (chartContainer.value) {
    chart = createChart(chartContainer.value, {
      layout: {
        background: { type: 'solid', color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2b2b43' },
        horzLines: { color: '#2b2b43' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
      },
      autoSize: true,
    });

    candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 6,
        minMove: 0.000001,
      },
    });

    volumeSeries = chart.addSeries(HistogramSeries, {
      color: '#26a69a',
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume_scale', // Use a specific ID
      pane: 1, // Use pane: 1 to create a new pane below
    });

    // Configure the volume scale
    chart.priceScale('volume_scale').applyOptions({
      mode: PriceScaleMode.Logarithmic,
      // Adjust margins WITHIN the volume pane to make bars shorter
      scaleMargins: {
        top: 0.9, // 90% margin from the top, makes the bars very short
        bottom: 0,
      },
    });

    // --- Watch for real-time data from Pinia store ---
    watch(() => stockStore.latestTrades[props.symbol], (newTrade) => {
      if (newTrade && newTrade.p && newTrade.t && newTrade.v) {
        addTrade(newTrade);
      }
    }, {
      deep: true 
    });
  }
});

// --- Chart Data Handling ---
function addTrade(trade) {
  const price = trade.p;
  const volume = trade.v;
  const timeInSeconds = Math.floor(trade.t / 1000);
  const candleTimeKey = timeInSeconds - (timeInSeconds % INTERVAL_SECONDS);

  // Update current price
  currentPrice.value = price;

  let candle = OHLCV_data[candleTimeKey];
  if (!candle) {
    candle = {
      time: candleTimeKey,
      open: price,
      high: price,
      low: price,
      close: price,
      volume: volume,
    };
    OHLCV_data[candleTimeKey] = candle;
    
    const allCandleData = Object.values(OHLCV_data).map(c => ({time: c.time, open: c.open, high: c.high, low: c.low, close: c.close})).sort((a,b) => a.time - b.time);
    const allVolumeData = Object.values(OHLCV_data).map(c => ({time: c.time, value: c.volume, color: c.open <= c.close ? '#26a69a' : '#ef5350'})).sort((a,b) => a.time - b.time);
    
    candleSeries.setData(allCandleData);
    volumeSeries.setData(allVolumeData);

  } else {
    candle.high = Math.max(candle.high, price);
    candle.low = Math.min(candle.low, price);
    candle.close = price;
    candle.volume += volume;

    const candleData = { time: candle.time, open: candle.open, high: candle.high, low: candle.low, close: candle.close };
    const volumeData = { time: candle.time, value: candle.volume, color: candle.open <= candle.close ? '#26a69a' : '#ef5350' };
    
    candleSeries.update(candleData);
    volumeSeries.update(volumeData);
  }
}

// --- Component Cleanup ---
onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
});
</script>

<style scoped>
.stock-chart-wrapper {
  background: #131722;
  border-radius: 8px;
  padding: 20px;
  color: #d1d4dc;
}

.chart-header {
  text-align: left;
  margin-bottom: 15px;
}

.stock-symbol {
  font-size: 16px;
  color: #8a8a8a;
  font-weight: normal;
  margin: 0;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  margin: 5px 0;
}

.price-change {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
}

.price-change.positive {
  color: #26a69a; /* Green */
}

.price-change.negative {
  color: #ef5350; /* Red */
}

.chart-container {
  width: 100%;
  height: 300px; /* Adjust height as needed */
}
</style>
