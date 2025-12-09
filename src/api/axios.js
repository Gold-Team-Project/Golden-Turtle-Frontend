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
                originalRequest._retry = true; // Mark request as retried
                
                let resolvePromise;
                const retryPromise = new Promise((resolve, reject) => {
                    resolvePromise = resolve;
                });
                failedQueue.push({ resolve: resolvePromise, reject: error });

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