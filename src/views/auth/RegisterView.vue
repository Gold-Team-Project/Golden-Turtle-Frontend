<!-- src/views/auth/RegisterView.vue -->
<template>
  <AuthLayout>
    <AuthCard>
      <h1 class="title">회원가입</h1>
      <form @submit.prevent="handleRegister">
        <div class="field">
          <label>이메일</label>
          <input v-model="userEmail" type="text" :disabled="isEmailVerified" />
          <div class="button-message-row"> <!-- New wrapper for button and message alignment -->
            <p v-if="emailMessage" class="verify-message">{{ emailMessage }}</p>
            <CommonButton class="verify-btn" type="button" @click="handleSendCode" :disabled="isEmailVerified">인증</CommonButton>
          </div>
        </div>

        <div class="field">
          <label>인증번호</label>
          <input v-model="verificationCode" type="text" :disabled="isEmailVerified" />
          <div class="button-message-row"> <!-- New wrapper for button and message alignment -->
            <p v-if="codeMessage" class="verify-message" :class="{ 'success': isEmailVerified }">{{ codeMessage }}</p>
            <CommonButton class="verify-btn" type="button" @click="handleVerifyCode" :disabled="isEmailVerified">확인</CommonButton>
          </div>
        </div>

        <div class="field">
          <label>닉네임</label>
          <input v-model="userNickname" type="text" />
        </div>

        <div class="field">
          <label>비밀번호</label>
          <input v-model="userPassword" type="password" />
        </div>

        <div class="field">
          <label>비밀번호 확인</label>
          <input v-model="passwordConfirm" type="password" />
        </div>

        <div class="button-container">
          <CommonButton class="register-btn" type="submit">회원가입</CommonButton>
        </div>
      </form>
    </AuthCard>
  </AuthLayout>
</template>

<script setup>
import { ref } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import AuthCard from "@/components/auth/AuthCard.vue";
import CommonButton from "@/components/common/button/CommonButton.vue";
import { useAuthStore } from "@/stores/auth";

const userEmail = ref("");
const verificationCode = ref("");
const userNickname = ref("");
const userPassword = ref("");
const passwordConfirm = ref("");

// For dynamic messages and verification status
const emailMessage = ref("");
const codeMessage = ref("");
const isEmailVerified = ref(false);

const authStore = useAuthStore();

// Step 1: Send verification code
const handleSendCode = async () => {
  if (!userEmail.value) {
    emailMessage.value = "이메일을 입력해주세요.";
    return;
  }
  emailMessage.value = "인증번호를 발송 중입니다...";
  const success = await authStore.sendVerificationCode(userEmail.value);
  if (success) {
    emailMessage.value = "인증번호가 발송되었습니다. 메일을 확인해주세요.";
  } else {
    emailMessage.value = "인증번호 발송에 실패했습니다.";
  }
};

// Step 2: Verify the code
const handleVerifyCode = async () => {
  if (!verificationCode.value) {
    codeMessage.value = "인증번호를 입력해주세요.";
    return;
  }
  const success = await authStore.verifyEmail({
    email: userEmail.value,
    code: verificationCode.value,
  });

  if (success) {
    isEmailVerified.value = true;
    codeMessage.value = "이메일 인증이 완료되었습니다.";
  } else {
    isEmailVerified.value = false;
    codeMessage.value = "인증번호가 일치하지 않습니다.";
  }
};

// Step 3: Final registration
const handleRegister = async () => {
  if (!isEmailVerified.value) {
    alert("이메일 인증을 먼저 완료해주세요.");
    return;
  }
  if (userPassword.value !== passwordConfirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  if (!userNickname.value || !userPassword.value) {
    alert("닉네임과 비밀번호를 모두 입력해주세요.");
    return;
  }

  await authStore.signup({
    userEmail: userEmail.value,
    userPassword: userPassword.value,
    userNickname: userNickname.value,
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

.button-message-row { /* New style for button and message alignment */
  display: flex;
  align-items: center; /* Vertically center button and text */
  justify-content: flex-end; /* Align button and text to the right */
  margin-top: 10px; /* Spacing below the input */
}
.button-message-row .verify-btn {
  width: 80px; /* Smaller width for buttons */
  height: 38px;
  margin-left: 10px; /* Space between message and button */
  background: #ffc933;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.3s ease; /* Add transition */
}
.button-message-row .verify-btn:hover {
  background-color: #F2CA57;
}
.button-message-row .verify-message {
  margin-top: 0; /* Remove top margin as it's now in a flex row */
  margin-right: 10px; /* Space between message and button */
  white-space: nowrap; /* Try to keep text on one line */
  overflow: hidden; /* Hide overflow if text is too long */
  text-overflow: ellipsis; /* Add ellipsis for overflow */
  flex-shrink: 1; /* Allow message to shrink */
  min-width: 0; /* Allow message to shrink below its content size */
  color: red; /* Default color for messages */
  font-size: 12px;
}
.button-message-row .verify-message.success {
    color: #4caf50; /* Green for success */
}


.verify-btn:disabled {
    background: #555;
    cursor: not-allowed;
}

/* Original .verify-message styles, now mostly moved into .button-message-row .verify-message */
.verify-message {
  color: red;
  font-size: 12px;
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
  transition: background-color 0.3s ease; /* Add transition */
}
.register-btn:hover {
  background-color: #F2CA57;
}

@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  /* .verify-btn media query might need adjustment if default width is 100% */
}
</style>

