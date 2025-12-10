<!-- src/views/LoginView.vue -->
<template>
  <AuthLayout>
    <AuthCard>
      <h1 class="title">로그인</h1>
      <!-- Add form tag and submit handler -->
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>이메일</label>
          <input v-model="userEmail" type="text" />
        </div>

        <div class="field">
          <label>비밀번호</label>
          <input v-model="userPassword" type="password" />
        </div>

        <div class="button-container">
          <!-- Change button type to submit -->
          <CommonButton class="login-btn" type="submit">로그인</CommonButton>
        </div>
      </form>

      <div class="links">
        <RouterLink to="/register">회원가입</RouterLink>
        <RouterLink to="/find-password">비밀번호찾기</RouterLink>
      </div>
    </AuthCard>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AuthCard from "@/components/auth/AuthCard.vue";
import CommonButton from "@/components/common/button/CommonButton.vue";
import { useAuthStore } from "@/stores/auth"; // Import auth store

// Rename to match backend API spec
const userEmail = ref("");
const userPassword = ref("");

const authStore = useAuthStore(); // Initialize auth store

const handleLogin = async () => {
  await authStore.login({
    userEmail: userEmail.value,
    userPassword: userPassword.value,
  });
};
</script>

<style scoped>
.title {
  color: white;
  text-align: center;
  margin-bottom: 30px;
}

.field {
  color: white;
  margin-bottom: 20px;
}

input {
  width: 100%;
  height: 38px;
  border-radius: 5px;
  padding: 8px;
}
.button-container {
  display: flex;
  justify-content: center;
}

.login-btn {
  width: 120px;
  height: 40px;
  margin-top: 25px;
  background: #ffc933;
  border-radius: 5px;
  font-weight: bold;
}

.links {
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.links a {
  color: white;
  text-decoration: none;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .links {
    font-size: 12px;
  }
}
</style>
