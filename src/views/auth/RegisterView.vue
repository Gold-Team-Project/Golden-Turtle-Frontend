<!-- src/views/auth/RegisterView.vue -->
<template>
  <AuthLayout>
    <AuthCard>
      <h1 class="title">회원가입</h1>

      <div class="field">
        <label>이메일</label>
        <div class="email-field">
          <input v-model="email" type="text" />
          <CommonButton class="verify-btn">인증</CommonButton>
        </div>
        <p class="verify-message">*인증번호가 발송되었습니다.</p>
      </div>

      <div class="field">
        <label>인증번호</label>
        <input v-model="verificationCode" type="text" />
      </div>

      <div class="field">
        <label>닉네임</label>
        <input v-model="nickname" type="text" />
      </div>

      <div class="field">
        <label>비밀번호</label>
        <input v-model="password" type="password" />
      </div>

      <div class="field">
        <label>비밀번호 확인</label>
        <input v-model="passwordConfirm" type="password" />
      </div>

      <div class="button-container">
        <CommonButton class="register-btn">회원가입</CommonButton>
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
const verificationCode = ref("");
const nickname = ref("");
const password = ref("");
const passwordConfirm = ref("");
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

.email-field {
  display: flex;
}

.email-field input {
  flex-grow: 1;
}

.verify-btn {
  width: 80px;
  height: 38px;
  margin-left: 10px;
  background: #ffc933;
  border-radius: 5px;
  font-weight: bold;
}

.verify-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}

.button-container {
  display: flex;
  justify-content: center;
}

.register-btn {
  width: 120px;
  height: 40px;
  margin-top: 25px;
  background: #ffc933;
  border-radius: 5px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .verify-message {
    font-size: 10px;
  }

  .verify-btn {
    width: 60px;
    height: 38px;
  }
}
</style>
