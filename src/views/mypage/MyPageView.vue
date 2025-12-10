<!-- src/views/mypage/MyPageView.vue -->
<template>
  <div class="mypage-container">
    <MyInfo />
    <PasswordChange />
    <AccountWithdrawal />
  </div>
</template>

<script setup>
import MyInfo from '@/components/mypage/MyInfo.vue';
import PasswordChange from '@/components/mypage/PasswordChange.vue';
import AccountWithdrawal from '@/components/mypage/AccountWithdrawal.vue';
</script>

<style scoped>
.mypage-container {
  padding: 40px;
  max-width: 800px; /* Limit the max width for better readability on large screens */
  margin: 0 auto; /* Center the container */
}
</style>
