import { defineStore } from 'pinia'; // Pinia 스토어를 정의하기 위한 함수 임포트
import api from '@/api/axios'; // axios 인스턴스 임포트 (인터셉터가 설정된)
import router from '@/router'; // Vue Router 인스턴스 임포트

// 'auth'라는 이름의 Pinia 스토어 정의
export const useAuthStore = defineStore('auth', {
  // 스토어의 상태(state) 정의: 애플리케이션의 인증 관련 데이터를 저장합니다.
  state: () => ({
    // Access Token: API 요청 시 사용되는 단기 토큰입니다. localStorage에서 가져오거나 null로 초기화됩니다.
    accessToken: localStorage.getItem('accessToken') || null,
    // Refresh Token: Access Token 만료 시 새 Access Token을 발급받기 위해 사용되는 장기 토큰입니다.
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),

  // 스토어의 게터(getters) 정의: 상태를 기반으로 파생된 데이터를 계산합니다.
  getters: {
    // 사용자가 로그인했는지 여부를 반환합니다. accessToken이 존재하면 true입니다.
    isLoggedIn: (state) => !!state.accessToken,
  },

  // 스토어의 액션(actions) 정의: 비동기 로직 및 상태 변경을 처리하는 메서드입니다.
  actions: {
    // 이메일 인증 코드 발송 액션
    async sendVerificationCode(email) {
      try {
        // '/api/v1/auth/send-verification' 엔드포인트로 이메일과 함께 POST 요청을 보냅니다.
        const response = await api.post('/api/v1/auth/send-verification', { email });
        if (response.data && response.data.success) {
          // 요청 성공 시 알림 메시지를 표시하고 true를 반환합니다.
          alert(response.data.data || '인증번호가 발송되었습니다.');
          return true;
        } else {
          // 요청 실패 시 서버 메시지 또는 기본 실패 메시지를 표시하고 false를 반환합니다.
          alert(response.data.message || '인증번호 발송에 실패했습니다.');
          return false;
        }
      } catch (error) {
        // 네트워크 오류 등 예외 발생 시 콘솔에 오류를 기록하고 알림 메시지를 표시합니다.
        console.error('Send verification code error:', error);
        alert('인증번호 발송 중 오류가 발생했습니다.');
        return false;
      }
    },

    // 이메일 인증 코드 검증 액션
    async verifyEmail({ email, code }) {
      try {
        // '/api/v1/auth/verify-email' 엔드포인트로 이메일과 인증 코드와 함께 POST 요청을 보냅니다.
        const response = await api.post('/api/v1/auth/verify-email', { email, code });
        if (response.data && response.data.success) {
          // 검증 성공 시 알림 메시지를 표시하고 true를 반환합니다.
          alert(response.data.data || '이메일 인증이 완료되었습니다.');
          return true;
        } else {
          // 검증 실패 시 서버 메시지 또는 기본 실패 메시지를 표시하고 false를 반환합니다.
          alert(response.data.message || '이메일 인증에 실패했습니다.');
          return false;
        }
      } catch (error) {
        // 예외 발생 시 콘솔에 오류를 기록하고 알림 메시지를 표시합니다.
        console.error('Verify email error:', error);
        alert('이메일 인증 중 오류가 발생했습니다.');
        return false;
      }
    },

    // 로그인 액션
    async login(credentials) {
      try {
        // 사용자 이메일과 비밀번호의 앞뒤 공백을 제거합니다.
        const trimmedCredentials = {
          userEmail: credentials.userEmail.trim(),
          userPassword: credentials.userPassword.trim(),
        };
        // '/api/v1/auth/login' 엔드포인트로 로그인 정보를 POST 요청으로 보냅니다.
        const response = await api.post('/api/v1/auth/login', trimmedCredentials);
        if (response.data && response.data.success) {
          // 로그인 성공 시 응답에서 Access Token과 Refresh Token을 추출합니다.
          const { accessToken, refreshToken } = response.data.data;
          this.accessToken = accessToken; // 스토어 상태 업데이트
          this.refreshToken = refreshToken; // 스토어 상태 업데이트

          // 토큰을 Local Storage에 저장하여 새로고침 시에도 유지되도록 합니다.
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          // 모든 후속 요청에 대해 Authorization 헤더를 수동으로 설정합니다. (액시오스 인터셉터가 이미 처리하지만, 명시적 설정)
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // 로그인 성공 후 메인 페이지로 이동합니다.
          await router.push('/'); 
          return true;
        } else {
          // 서버에서 success: false 응답이 온 경우 (예: 잘못된 자격 증명)
          alert(response.data.message || '로그인에 실패했습니다.');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        // 오류 응답이 있고, 상태 코드가 401인 경우 사용자에게 친화적인 메시지를 표시
        if (error.response && error.response.status === 401) {
          alert('이메일 또는 비밀번호가 잘못되었습니다.');
        } else {
          // 그 외 네트워크 오류 등의 경우 일반적인 오류 메시지를 표시
          alert('로그인 중 오류가 발생했습니다.');
        }
        return false;
      }
    },

    // 회원가입 액션
    async signup(userInfo) {
      try {
        // '/api/v1/auth/signup' 엔드포인트로 사용자 정보와 함께 POST 요청을 보냅니다.
        const response = await api.post('/api/v1/auth/signup', userInfo);
        if (response.data && response.data.success) {
          // 회원가입 성공 시 알림 메시지를 표시하고 로그인 페이지로 이동합니다.
          alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
          await router.push('/login'); 
          return true;
        } else {
          // 회원가입 실패 시 서버 메시지 또는 기본 실패 메시지를 표시합니다.
          alert(response.data.message || '회원가입에 실패했습니다.');
          return false;
        }
      } catch (error) {
        // 예외 발생 시 콘솔에 오류를 기록하고 알림 메시지를 표시합니다.
        console.error('Signup error:', error);
        alert('회원가입 중 오류가 발생했습니다.');
        return false;
      }
    },

    // 로그아웃 액션
    async logout() {
        try {
            // 서버에 로그아웃 요청을 보냅니다. 백엔드에서 토큰 무효화를 처리하는 경우에 필요합니다.
            // 클라이언트 측의 토큰 삭제와 별개로 서버 세션/토큰 무효화를 위해 호출합니다.
            await api.post('/api/v1/auth/logout');
        } catch (error) {
            // API 호출 실패 시 (예: 서버에 연결할 수 없거나 토큰이 이미 무효화된 경우)
            console.error('Logout API call failed:', error);
            // API 호출 실패와 관계없이 클라이언트 측에서는 로그아웃 처리를 계속 진행합니다.
        } finally {
            // 항상 실행되는 블록: 상태와 로컬 스토리지에서 모든 토큰 정보를 정리합니다.
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken'); // Local Storage에서 Access Token 삭제
            localStorage.removeItem('refreshToken'); // Local Storage에서 Refresh Token 삭제
            // axios 인스턴스의 기본 Authorization 헤더도 삭제하여 더 이상 유효하지 않은 토큰이 전송되지 않도록 합니다.
            delete api.defaults.headers.common['Authorization'];
            alert('로그아웃 되었습니다.'); // 로그아웃 완료 알림
            await router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
        }
    },

    // 애플리케이션 새로고침 시 인증 상태를 Local Storage에서 복원하는 액션
    restoreState() {
        const accessToken = localStorage.getItem('accessToken'); // Local Storage에서 Access Token을 가져옵니다.
        if (accessToken) {
            // Access Token이 존재하면 스토어 상태를 복원하고 Refresh Token도 가져옵니다.
            this.accessToken = accessToken;
            this.refreshToken = localStorage.getItem('refreshToken');
            // axios 인스턴스의 기본 Authorization 헤더를 복원된 Access Token으로 설정합니다.
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
    }
  },
});
