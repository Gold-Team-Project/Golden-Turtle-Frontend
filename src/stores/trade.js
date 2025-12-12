import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/api/axios'; // axios 인스턴스 임포트

export const useTradeStore = defineStore('trade', () => {
  const userHoldings = ref([]);
  const pagination = ref({});

  const buyStock = async (ticker, quantity) => {
    try {
      // fetch를 api.post로 변경
      const response = await api.post('/api/v1/buysell/buy', { ticker, quantity });

      if (response.data.success) {
        console.log(`Successfully bought ${quantity} of ${ticker}`);
        await fetchHoldings();
        return true;
      } else {
        console.error('API response indicates failure:', response.data);
        throw new Error(`API error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error buying stock:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const sellStock = async (ticker, quantity) => {
    try {
      // fetch를 api.post로 변경
      const response = await api.post('/api/v1/buysell/sell', { ticker, quantity });

      if (response.data.success) {
        console.log(`Successfully sold ${quantity} of ${ticker}`);
        await fetchHoldings();
        return true;
      } else {
        console.error('API response indicates failure:', response.data);
        throw new Error(`API error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error selling stock:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  const fetchHoldings = async (page = 0, size = 10) => {
    const gameSessionId = localStorage.getItem("gameSessionId");
    if (!gameSessionId) {
      console.error('gameSessionId is not available in localStorage. Cannot fetch holdings.');
      return;
    }

    try {
      // fetch를 api.get으로 변경
      const response = await api.get('/api/v1/buysell/holdings', {
        params: { gameSessionId, page, size }
      });

      if (response.data.success && response.data.data) {
        userHoldings.value = response.data.data.holdings;
        pagination.value = response.data.data.pagination;
        console.log('User holdings fetched:', userHoldings.value);
        return true;
      } else {
        console.error('API response indicates failure or missing data:', response.data);
        throw new Error(`API error: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching holdings:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  };

  return {
    userHoldings,
    pagination,
    buyStock,
    sellStock,
    fetchHoldings,
  };
});
