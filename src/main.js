import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { setAuthInterceptors } from './api/axios' // NEW import

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Pinia 스토어를 초기화하고, 앱 시작 시 localStorage에서 토큰을 복원합니다.
const authStore = useAuthStore()
authStore.restoreState()

// 인증 스토어 초기화 후 axios 인터셉터 설정
setAuthInterceptors(authStore) // NEW line

app.mount('#app')
