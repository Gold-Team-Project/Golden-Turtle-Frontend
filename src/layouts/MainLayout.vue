<template>
  <div class="layout">

    <Header />

    <div class="layout-body">
      <div class="layout-sidebar">
        <Sidebar @open-modal="openModal" />
      </div>

      <main class="layout-main">
        <router-view />
      </main>
    </div>

    <ResultModal
        v-if="showModal"
        :result="modalData"
        @close="closeModal"
        class="modal-root"
    />
  </div>
</template>

<script setup>
import { ref } from "vue"
import Header from "@/components/layout/header/Header.vue"
import Sidebar from "@/components/layout/sidebar/Sidebar.vue"
import ResultModal from "@/components/modal/ModalResult.vue"

const showModal = ref(false)

const modalData = ref({
  rank: 1,
  nickname: "김폭주기관차",
  totalAsset: 38732000,
  returnRate: 387.32
})

const openModal = (data) => {
  modalData.value = data
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #2b1f0f;
  position: relative; /* 모달을 위에 띄우기 위한 기준점 */
}

.layout-body {
  display: flex;
  flex: 1;
  height: calc(100vh - 84px);
  overflow: hidden;
}

.layout-sidebar {
  width: 272px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #2d291f;
}

.layout-main {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 40px 60px 40px 40px;
  overflow: hidden;
  min-width: 0;
}

/* 모달이 항상 레이아웃 맨 위에 오도록 */
.modal-root {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}
</style>
