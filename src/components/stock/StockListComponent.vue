<template>
  <div class="gt-box">
    <div class="stock-list-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>종목 코드</th>
            <th>종목 이름</th>
            <th>종목 시장</th>
            <th>현재가</th>
            <th>일일 변동</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td>{{ row.code }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.market }}</td>
            <td>{{ row.price }}</td>
            <td :class="getChangeClass(row.change)">{{ row.change }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import '@/assets/stock/StockList.css';

const rows = [
  { code: 'BTC', name: '비트코인', market: '???', price: '$212.65', change: '+11.22%' },
  { code: 'ETH', name: '이더리움', market: '???', price: '$150.45', change: '-2.55%' },
  { code: 'DOGE', name: '도지코인', market: '???', price: '$0.12', change: '+5.87%' },
  { code: 'SOL', name: '솔라나', market: '???', price: '$95.30', change: '-8.14%' },
  { code: 'ADA', name: '에이다', market: '???', price: '$0.45', change: '+1.00%' },
  { code: 'XRP', name: '리플', market: '???', price: '$0.52', change: '-0.50%' },
];

const getChangeClass = (change) => {
  if (change.startsWith('+')) {
    return 'positive-change';
  } else if (change.startsWith('-')) {
    return 'negative-change';
  }
  return '';
};
</script>