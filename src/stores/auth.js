import { defineStore } from 'pinia';
import api from '@/api/axios';
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
  },
  actions: {
    // 이메일 인증 코드 발송
    async sendVerificationCode(email) {
      try {
        const response = await api.post('/api/v1/auth/send-verification', { email });
        if (response.data && response.data.success) {
          alert(response.data.data || '인증번호가 발송되었습니다.');
          return true;
        } else {
          alert(response.data.message || '인증번호 발송에 실패했습니다.');
          return false;
        }
      } catch (error) {
        console.error('Send verification code error:', error);
        alert('인증번호 발송 중 오류가 발생했습니다.');
        return false;
      }
    },

    // 이메일 인증 코드 검증
    async verifyEmail({ email, code }) {
      try {
        const response = await api.post('/api/v1/auth/verify-email', { email, code });
        if (response.data && response.data.success) {
          alert(response.data.data || '이메일 인증이 완료되었습니다.');
          return true;
        } else {
          alert(response.data.message || '이메일 인증에 실패했습니다.');
          return false;
        }
      } catch (error) {
        console.error('Verify email error:', error);
        alert('이메일 인증 중 오류가 발생했습니다.');
        return false;
      }
    },

    async login(credentials) {
      try {
        const trimmedCredentials = {
          userEmail: credentials.userEmail.trim(),
          userPassword: credentials.userPassword.trim(),
        };
        const response = await api.post('/api/v1/auth/login', trimmedCredentials);
        if (response.data && response.data.success) {
          const { accessToken, refreshToken } = response.data.data;
          this.accessToken = accessToken;
          this.refreshToken = refreshToken;

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          await router.push('/'); // 로그인 성공 시 메인 페이지로 이동
          return true;
        } else {
          // 서버에서 success: false 응답
          alert(response.data.message || '로그인에 실패했습니다.');
          return false;
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('로그인 중 오류가 발생했습니다.');
        return false;
      }
    },
    async signup(userInfo) {
      try {
        const response = await api.post('/api/v1/auth/signup', userInfo);
        if (response.data && response.data.success) {
          alert('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
          await router.push('/login'); // 회원가입 성공 시 로그인 페이지로 이동
          return true;
        } else {
          alert(response.data.message || '회원가입에 실패했습니다.');
          return false;
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('회원가입 중 오류가 발생했습니다.');
        return false;
      }
    },
    async logout() {
        try {
            // 서버에 로그아웃 요청을 보냅니다. 
            // 백엔드에서 토큰 무효화를 처리하는 경우에 필요합니다.
            await api.post('/api/v1/auth/logout');
        } catch (error) {
            console.error('Logout API call failed:', error);
            // API 호출 실패와 관계없이 클라이언트 측에서는 로그아웃 처리를 계속 진행합니다.
        } finally {
            // 상태와 로컬 스토리지 정리
            this.accessToken = null;
            this.refreshToken = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            delete api.defaults.headers.common['Authorization'];
            alert('로그아웃 되었습니다.');
            await router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
        }
    },
    // 페이지 새로고침 시 상태 복원
    restoreState() {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            this.accessToken = accessToken;
            this.refreshToken = localStorage.getItem('refreshToken');
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        }
    }
  },
});
