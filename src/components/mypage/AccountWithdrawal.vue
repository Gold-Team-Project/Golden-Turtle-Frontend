<!-- src/components/mypage/AccountWithdrawal.vue -->
<template>
  <div class="mypage-section withdrawal-section">
    <el-button 
      class="withdrawal-btn" 
      type="danger" 
      plain 
      @click="handleWithdrawal"
      :loading="isLoading"
      :disabled="isLoading"
    >
      회원탈퇴
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElNotification, ElMessageBox } from 'element-plus';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth'; // Import auth store for logout

const authStore = useAuthStore();
const isLoading = ref(false);

const handleWithdrawal = async () => {
  try {
    await ElMessageBox.confirm('정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.', '경고', {
      confirmButtonText: '탈퇴',
      cancelButtonText: '취소',
      type: 'warning',
    });

    isLoading.value = true;
    const response = await api.delete('/api/v1/user/me/delete');

    if (response.data.success) {
      ElNotification({ title: '성공', message: '회원탈퇴가 완료되었습니다.', type: 'success' });
      await authStore.logout(); // Logout and redirect to login page
    } else {
      ElNotification({ title: '오류', message: response.data.message || '회원탈퇴 실패', type: 'error' });
    }
  } catch (error) {
    if (error === 'cancel') {
      ElNotification({ title: '취소', message: '회원탈퇴가 취소되었습니다.', type: 'info' });
    } else {
      ElNotification({ title: '오류', message: error.response?.data?.message || '회원탈퇴 중 오류 발생', type: 'error' });
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.withdrawal-section {
  display: flex;
  justify-content: flex-start;
  margin-top: 40px;
}
.withdrawal-btn {
  font-weight: bold;
}
</style>
