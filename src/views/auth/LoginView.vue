<!-- src/views/LoginView.vue -->
<template>
  <AuthLayout>
    <AuthCard>
      <h1 class="title">로그인</h1>

      <div class="field">
        <label>이메일</label>
        <input v-model="email" type="text" />
      </div>

      <div class="field">
        <label>비밀번호</label>
        <input v-model="password" type="password" />
      </div>

      <div class="button-container">
        <CommonButton class="login-btn">로그인</CommonButton>
      </div>

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

const email = ref("");
const password = ref("");
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
