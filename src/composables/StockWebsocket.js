import { ref } from 'vue'

const VITE_FINNHUB_API_URL = import.meta.env.VITE_FINNHUB_API_URL

export function useStockWebSocket() {
  const trades = ref([])
  const isConnected = ref(false)
  let socket = null

  const connect = (symbol) => {
    if (socket) return

    socket = new WebSocket(`${VITE_FINNHUB_API_URL}`)

    socket.onopen = () => {
      isConnected.value = true
      socket.send(JSON.stringify({ type: 'subscribe', symbol }))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'trade') {
        trades.value = [...trades.value, ...data.data]
      }
    }

    socket.onclose = () => {
      isConnected.value = false
      socket = null
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  }

  const disconnect = () => {
    if (socket) {
      socket.close()
    }
  }

  return {
    trades,
    isConnected,
    connect,
    disconnect
  }
}
