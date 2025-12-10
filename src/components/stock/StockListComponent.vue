<template>
  <div class="gt-box">
    <div class="stock-list-header">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="종목 검색" 
        class="stock-search-bar"
      />
    </div>
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
          <tr v-for="(row, i) in paginatedRows" :key="i">
            <td>{{ row.code }}</td>
            <td>{{ row.name }}</td>
            <td>{{ row.market }}</td>
            <td>{{ row.price }}</td>
            <td :class="getChangeClass(row.change)">{{ row.change }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <Pagination
        v-model:currentPage="currentPage"
        :total-pages="totalPages"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Pagination from '@/components/common/paging/Pagination.vue';
import '@/assets/stock/StockList.css';

const allRows = ref([
  { code: 'BTC', name: '비트코인', market: '???', price: '$212.65', change: '+11.22%' },
  { code: 'ETH', name: '이더리움', market: '???', price: '$150.45', change: '-2.55%' },
  { code: 'DOGE', name: '도지코인', market: '???', price: '$0.12', change: '+5.87%' },
  { code: 'SOL', name: '솔라나', market: '???', price: '$95.30', change: '-8.14%' },
  { code: 'ADA', name: '에이다', market: '???', price: '$0.45', change: '+1.00%' },
  { code: 'XRP', name: '리플', market: '???', price: '$0.52', change: '-0.50%' },
  { code: 'LTC', name: '라이트코인', market: '???', price: '$65.10', change: '+3.20%' },
  { code: 'BNB', name: '바이낸스코인', market: '???', price: '$300.20', change: '-1.10%' },
  { code: 'DOT', name: '폴카닷', market: '???', price: '$7.80', change: '+0.50%' },
  { code: 'LINK', name: '체인링크', market: '???', price: '$15.60', change: '-2.00%' },
  { code: 'BCH', name: '비트코인캐시', market: '???', price: '$250.00', change: '+1.50%' },
  { code: 'UNI', name: '유니스왑', market: '???', price: '$6.70', change: '-0.80%' },
  { code: 'AVAX', name: '아발란체', market: '???', price: '$25.30', change: '+2.10%' },
  { code: 'ICP', name: '인터넷컴퓨터', market: '???', price: '$4.20', change: '-0.20%' },
  { code: 'VET', name: '체인링크', market: '???', price: '$0.03', change: '+4.00%' },
  { code: 'FIL', name: '파일코인', market: '???', price: '$5.50', change: '-1.30%' },
  { code: 'TRX', name: '트론', market: '???', price: '$0.08', change: '+0.70%' },
  { code: 'XLM', name: '스텔라루멘', market: '???', price: '$0.11', change: '-0.40%' },
  { code: 'EOS', name: '이오스', market: '???', price: '$0.80', change: '+1.00%' },
  { code: 'XTZ', name: '테조스', market: '???', price: '$0.90', change: '-0.60%' },
]);

/* SEARCH */
const searchQuery = ref('');

const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return allRows.value;
  }
  const query = searchQuery.value.toLowerCase();
  return allRows.value.filter(row =>
    row.name.toLowerCase().includes(query) ||
    row.code.toLowerCase().includes(query)
  );
});

/* PAGINATION */
const rowsPerPage = 7;
const currentPage = ref(1);

const totalPages = computed(() =>
    Math.ceil(filteredRows.value.length / rowsPerPage)
);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return filteredRows.value.slice(start, end);
});

const getChangeClass = (change) => {
  if (change.startsWith('+')) {
    return 'positive-change';
  } else if (change.startsWith('-')) {
    return 'negative-change';
  }
  return '';
};
</script>