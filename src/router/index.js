import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import MainContent from '@/views/main/MainContent.vue'

// 로그인/회원가입 등 메인레이아웃 제외 페이지
import LoginView from '@/views/auth/LoginView.vue'
import RegisterView from '@/views/auth/RegisterView.vue'
import FindPasswordView from '@/views/auth/FindPasswordView.vue'
import GameSessionParent from "@/pages/Account/GameSessionParent.vue";

const routes = [
    // ⭐ 메인 레이아웃이 적용되지 않는 페이지들
    {
        path: '/login',
        name: 'login',
        component: LoginView
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView
    },
    {
        path: '/find-password',
        name: 'find-password',
        component: FindPasswordView
    },

    // ⭐ MainLayout이 적용되는 페이지들
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: MainContent
            },
            //Account 페이지
            {
                path: 'gamesession/:userId',
                name: 'gamesession',
                component: GameSessionParent
            }
            // 필요하면 여기에 다른 MainLayout 페이지들 추가
        ]
    }
]


const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
