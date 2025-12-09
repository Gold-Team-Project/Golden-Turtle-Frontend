import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import * as StompJs from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const useStockStore = defineStore('stock', () => {
  // Use a reactive object to store the latest trade for each symbol.
  // The key will be the symbol (e.g., 'BINANCE:BTCUSDT'), and the value will be the trade data.
  const latestTrades = reactive({})
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

  return {
    latestTrades, // Return the new object-based state
    isConnected,
    connect,
    disconnect,
  }
})
