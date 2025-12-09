import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // Import auth store

import MainLayout from '@/layouts/MainLayout.vue'
import MainContent from '@/views/main/MainContent.vue'

// 로그인/회원가입 등 메인레이아웃 제외 페이지
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import FindPasswordView from '@/views/auth/FindPasswordView.vue'

const routes = [
    // ⭐ 메인 레이아웃이 적용되지 않는 페이지들 (로그인 없이 접근 가능, 로그인 상태에서 접근 시 메인으로 리디렉션)
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { noAuthRequired: true } // 로그인 필요 없는 페이지
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { noAuthRequired: true } // 로그인 필요 없는 페이지
    },
    {
        path: '/find-password',
        name: 'find-password',
        component: FindPasswordView,
        meta: { noAuthRequired: true } // 로그인 필요 없는 페이지
    },

    // ⭐ MainLayout이 적용되는 페이지들 (로그인 필요)
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: MainContent,
                meta: { requiresAuth: true } // 로그인 필요
            },
            // 필요하면 여기에 다른 MainLayout 페이지들 추가
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 네비게이션 가드 추가
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore(); // Pinia 스토어 인스턴스 가져오기

    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const noAuthRequired = to.matched.some(record => record.meta.noAuthRequired);

    if (requiresAuth && !authStore.isLoggedIn) {
        // 로그인이 필요한 페이지인데 로그인되어 있지 않다면 로그인 페이지로 리디렉션
        next({ name: 'login' });
    } else if (noAuthRequired && authStore.isLoggedIn) {
        // 로그인 필요 없는 페이지(로그인/회원가입)인데 로그인되어 있다면 메인 페이지로 리디렉션
        next({ name: 'home' });
    } else {
        // 그 외의 경우 정상적으로 페이지 이동
        next();
    }
});

export default router
