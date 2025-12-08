<!-- src/layouts/AuthLayout.vue -->
<template>
  <div class="auth-wrapper">
    <div class="left-area">
      <img src="@/assets/GOLDENTURTLE.svg" class="logo" />
      <h1 class="brand">Golden Turtle</h1>
    </div>

    <div class="right-area">
      <slot /> <!-- 로그인/회원가입/비번찾기 내용이 여기에 들어옴 -->
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
  background: #1f1b13;
}

.left-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffc933;
}

.logo {
  width: 350px;
}

.brand {
  margin-top: 20px;
  font-size: 48px;
  font-weight: bold;
}

.right-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
