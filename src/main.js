import { createApp } from 'vue' // Vue 애플리케이션 인스턴스를 생성하는 함수 임포트
import { createPinia } from 'pinia' // Pinia 상태 관리 라이브러리 인스턴스를 생성하는 함수 임포트

import App from './App.vue' // 최상위 Vue 컴포넌트인 App.vue 임포트
import router from './router' // Vue Router 인스턴스 임포트 (src/router/index.js에서 정의)
import { useAuthStore } from './stores/auth' // Pinia 인증 스토어 임포트
import { setAuthInterceptors } from './api/axios' // axios 인스턴스에 인터셉터를 설정하는 함수 임포트

const app = createApp(App) // Vue 애플리케이션 인스턴스 생성

app.use(createPinia()) // Pinia를 Vue 애플리케이션에 등록하여 전역 상태 관리를 활성화합니다.
app.use(router) // Vue Router를 Vue 애플리케이션에 등록하여 라우팅 기능을 활성화합니다.

// Pinia 스토어를 초기화하고, 앱 시작 시 localStorage에서 토큰을 복원합니다.
// 이렇게 하면 페이지 새로고침 시에도 로그인 상태가 유지됩니다.
const authStore = useAuthStore() // 인증 스토어 인스턴스를 가져옵니다.
authStore.restoreState() // 스토어의 restoreState 액션을 호출하여 Local Storage에서 토큰 정보를 복원합니다.

// 인증 스토어 초기화 후 axios 인터셉터 설정
// authStore가 완전히 로드되고 accessToken 및 refreshToken 상태를 사용할 수 있을 때
// axios 인스턴스에 인증 관련 요청/응답 인터셉터를 설정합니다.
// 이 인터셉터들은 모든 API 요청에 인증 헤더를 추가하고, 401 에러 발생 시 토큰을 자동 갱신하는 역할을 합니다.
setAuthInterceptors(authStore) 

app.mount('#app') // Vue 애플리케이션을 index.html 파일의 ID가 'app'인 요소에 마운트하여 시작합니다.
