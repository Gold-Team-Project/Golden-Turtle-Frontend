<template>
  <header class="gt-header">

    <!-- Left Logo -->
    <div class="gt-header-left">
      <img src="@/assets/GOLDENTURTLE.svg" alt="logo" class="gt-logo" />
      <span class="gt-title">Golden Turtle</span>
    </div>

    <!-- Right Navigation -->
    <nav class="gt-nav">
      <a href="/mypage">Mypage</a>
      <a href="/history">History</a>
      <a href="/market">Market</a>
      <a @click="goPortfolio" href="#">Portfolio</a>
      <!-- Modified logout link to trigger handleLogout function -->
      <a @click.prevent="handleLogout" href="#">Logout</a>
    </nav>

  </header>

  <div class="gt-header-divider"></div>
</template>

<script setup>
import "@/assets/header/Header.css"
import {useRoute, useRouter} from "vue-router";
import { useAuthStore } from '@/stores/auth'; // New import

const authStore = useAuthStore(); // Initialize auth store
const router = useRouter();
const goPortfolio = () =>{
  router.push({name: 'gamesession'})
}

const handleLogout = async () => {
  await authStore.logout();
};
</script>
