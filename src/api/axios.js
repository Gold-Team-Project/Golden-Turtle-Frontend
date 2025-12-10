import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAuthInterceptors = (authStore) => {
    // Request Interceptor: Add Authorization header
    instance.interceptors.request.use(
        (config) => {
            const accessToken = authStore.accessToken; // Get token from store
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle token refresh
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Prevent infinite loop if refresh token call itself fails or returns 401
            if (originalRequest.url === '/api/v1/auth/refresh') {
                authStore.logout(); // Refresh token failed, clear state and redirect to login
                return Promise.reject(error);
            }

            // If 401 and not already retrying
            if (error.response.status === 401 && !originalRequest._retry) {
                // 로그인 및 회원가입 엔드포인트에서 발생한 401 오류는 토큰 만료가 아닌 자격 증명 오류이므로
                // 토큰 갱신 및 로그아웃 로직을 건너뜁니다.
                if (originalRequest.url === '/api/v1/auth/login' || originalRequest.url === '/api/v1/auth/signup') {
                    return Promise.reject(error); // 오류를 그대로 전파하여 LoginView.vue에서 처리할 수 있도록 합니다.
                }

                originalRequest._retry = true; // 이 요청이 재시도되었음을 표시합니다.
                
                // 현재 요청을 대기 큐에 추가하여 토큰 새로 고침이 완료될 때까지 기다리게 합니다.
                let resolvePromise;
                let rejectPromise; // Promise의 reject 함수를 저장할 변수 추가
                const retryPromise = new Promise((resolve, reject) => {
                    resolvePromise = resolve; // 나중에 큐의 요청들을 해결할 때 사용할 resolve 함수를 저장합니다.
                    rejectPromise = reject; // Promise의 reject 함수도 저장합니다.
                });
                failedQueue.push({ resolve: resolvePromise, reject: rejectPromise }); // reject 함수를 올바르게 할당


                if (!isRefreshing) {
                    isRefreshing = true;
                    const refreshToken = authStore.refreshToken; // Get refresh token from store

                    if (!refreshToken) {
                        // No refresh token, can't refresh. Logout.
                        isRefreshing = false;
                        authStore.logout();
                        processQueue(error, null); // Reject all pending requests
                        return Promise.reject(error);
                    }

                    try {
                        // Attempt to refresh token
                        const refreshResponse = await instance.post('/api/v1/auth/refresh', { refreshToken });
                        
                        if (refreshResponse.data && refreshResponse.data.success) {
                            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
                            
                            // Update tokens in store and local storage
                            authStore.accessToken = newAccessToken;
                            authStore.refreshToken = newRefreshToken;
                            localStorage.setItem('accessToken', newAccessToken);
                            localStorage.setItem('refreshToken', newRefreshToken);

                            isRefreshing = false;
                            processQueue(null, newAccessToken); // Resolve all pending requests with new token
                            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                            return instance(originalRequest); // Retry the original request
                        } else {
                            // Refresh failed (e.g., refresh token expired)
                            isRefreshing = false;
                            authStore.logout(); // Refresh failed, logout
                            processQueue(error, null); // Reject all pending requests
                            return Promise.reject(error);
                        }
                    } catch (refreshError) {
                        isRefreshing = false;
                        authStore.logout(); // Refresh request itself failed, logout
                        processQueue(refreshError, null); // Reject all pending requests
                        return Promise.reject(refreshError);
                    }
                }
                // Return promise that will resolve/reject once token is refreshed
                return retryPromise.then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return instance(originalRequest);
                });
            }
            return Promise.reject(error);
        }
    );
};

export default instance;