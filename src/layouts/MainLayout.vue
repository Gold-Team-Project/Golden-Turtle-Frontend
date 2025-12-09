<template>
  <div class="layout">

    <Header />

    <div class="layout-body">
      <!-- 왼쪽 고정 Sidebar -->
      <div class="layout-sidebar">
        <Sidebar />
      </div>

      <!-- 오른쪽 메인 콘텐츠 -->
      <main class="layout-main">
        <router-view />
      </main>
    </div>

  </div>
</template>

<script setup>
import Header from "@/components/layout/header/Header.vue"
import Sidebar from "@/components/layout/sidebar/Sidebar.vue"
</script>

<style scoped>

/* ============================
   전체 레이아웃
============================ */
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #2b1f0f;
}

/* ============================
   Headerer 아래 부분 (여백 제거!)
============================ */
.layout-body {
  display: flex;
  width: 100%;
  flex: 1;

  margin: 0;
  padding: 0;
}

/* ============================
   Sidebar (밀착되도록 보장)
============================ */
.layout-sidebar {
  width: 272px;
  flex-shrink: 0;
  background-color: #2d291f;
  border-right: 1px solid rgba(255,255,255,0.1);

  margin: 0;
  padding: 0;
}

/* ============================
   오른쪽 메인 영역
============================ */
.layout-main {
  flex: 1;
  padding: 40px 60px;  /* 메인 콘텐츠 내부 여백 */
  overflow-y: auto;
}

</style>
