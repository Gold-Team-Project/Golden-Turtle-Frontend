import api from './axios';

export const getStockDetail = async (symbol) => {
    try {
        const response = await api.get(`/api/v1/stock/${symbol}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching stock detail for ${symbol}:`, error);
        throw error;
    }
};
