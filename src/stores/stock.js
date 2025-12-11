import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import * as StompJs from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const API_BASE_URL = 'http://localhost:8080/api/v1';


export const useStockStore = defineStore('stock', () => {
  // Use a reactive object to store the latest trade for each symbol.
  // The key will be the symbol (e.g., 'BINANCE:BTCUSDT'), and the value will be the trade data.
  const latestTrades = reactive({})
    const stocks = ref([]); // 주식 목록을 저장할 ref
  const isConnected = ref(false)
  let stompClient = null

  const connect = () => {
    if (stompClient?.active) {
      console.log('STOMP client is already active.')
      return
    }

    console.log('Connecting to STOMP server...')

    stompClient = new StompJs.Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/stock'),
      reconnectDelay: 5000,
      debug: (str) => {
        // console.log('STOMP DEBUG:', str)
      },
    })

    stompClient.onConnect = frame => {
      isConnected.value = true
      console.log('STOMP connected', frame)

      stompClient.subscribe('/topic/stock', msg => {
        try {
          const parsed = JSON.parse(msg.body)
          if (parsed.data && Array.isArray(parsed.data)) {
            // Iterate over each trade in the received data array
            for (const trade of parsed.data) {
              if (trade.s) {
                // Use the symbol 's' as the key and update the trade data.
                // Vue's reactivity will handle updates automatically.
                latestTrades[trade.s] = {
                  p: trade.p,
                  t: trade.t,
                  v: trade.v,
                  c: trade.c,
                }
              }
            }
          } else {
             console.warn('Received STOMP message with unexpected data structure:', parsed);
          }
        } catch (e) {
          console.error('STOMP message parse error', e)
        }
      })
    }

    stompClient.onStompError = frame => {
      isConnected.value = false
      console.error('STOMP error', frame)
    }
    
    stompClient.onWebSocketClose = () => {
        isConnected.value = false;
        console.log('STOMP WebSocket connection closed.');
    };

    stompClient.activate()
  }

  const disconnect = () => {
    if (stompClient) {
      stompClient.deactivate()
      console.log('STOMP client deactivated.')
    }
  }

// API에서 주식 목록을 가져오는 함수
    const fetchStockList = async () => {
        try {
            // AdminStockManager.vue에서 모든 종목을 로컬에서 페이지네이션하므로, size를 충분히 크게 설정하여 모든 종목을 가져옵니다.
            const response = await fetch(`${API_BASE_URL}/stocks?size=1000`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const apiResponse = await response.json(); // ApiResponse 구조로 응답을 받습니다.

            if (apiResponse.success && apiResponse.data) {
                // StockListResponse DTO를 AdminStockManager.vue에서 사용하는 형식으로 변환
                stocks.value = apiResponse.data.map(stock => ({
                    code: stock.ticker,
                    name: stock.name,
                    market: stock.market,
                    date: stock.createdAt ? stock.createdAt.split('T')[0] : 'N/A', // 날짜 부분만 추출 또는 기본값
                    isOperate: stock.status === 'ACTIVE',
                }));
                console.log('Fetched stock list:', stocks.value);
            } else {
                console.error('API response indicates failure or missing data:', apiResponse);
                stocks.value = [];
            }
        } catch (error) {
            console.error('Error fetching stock list:', error);
            stocks.value = []; // 에러 발생 시 목록 비우기
        }
    };

    //  종목을 활성화 하는 함수
    const activateStock = async (rawSymbol) => {
        const finnhubSymbol = `${rawSymbol.toUpperCase()}`;
        const requestUrl = `${API_BASE_URL}/crypto/${finnhubSymbol}`;
        try {
            const response = await fetch(requestUrl, {
            method: 'POST',
                headers:{
                'Content-Type': 'application/json',
                },
        });
            if (!response.ok) {
                // HTTP 에러인 경우 응답 본문을 파싱하여 상세 에러 메시지 확인
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
            }
            const apiResponse = await response.json(); // ApiResponse 구조로 응답을 받습니다.

            if (apiResponse.success) {
                console.log('Stock activated successfully for symbol:', finnhubSymbol);
                await fetchStockList(); // 주식 목록 새로고침
                return true; // 성공 여부 반환
            } else {
                console.error('API response indicates failure:', apiResponse);
                throw new Error(`API error: ${apiResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error adding stock:', error);
            throw error;
        }
    };

    // 종목 비활성화 하는 함수
    const deactivateStock = async (rawSymbol) => {
        const finnhubSymbol = `${rawSymbol.toUpperCase()}`;
        const requestUrl = `${API_BASE_URL}/crypto/${finnhubSymbol}`;
        try {
            const response = await fetch(requestUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`);
            }
            const apiResponse = await response.json();

            if (apiResponse.success) {
                console.log('Stock deactivated successfully for symbol:', finnhubSymbol);
                await fetchStockList(); // 종목 새로고침
                return true;
            } else {
                console.error('API response indicates failure:', apiResponse);
                throw new Error(`API error: ${apiResponse.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error deactivating stock:', error);
            throw error;
        }
    }

  return {
    latestTrades, // Return the new object-based state
      stocks,
    isConnected,
    connect,
    disconnect,
      fetchStockList,
      activateStock,
      deactivateStock
  }
});
