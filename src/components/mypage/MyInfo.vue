<!-- src/components/mypage/MyInfo.vue -->
<template>
  <div class="mypage-section">
    <h2 class="section-title">내 정보</h2>
    <div class="form-wrapper">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="handleNicknameChange(formRef)">
        <el-form-item label="닉네임" prop="nickname">
          <el-input 
            v-model="form.nickname" 
            placeholder="2~10자 이내의 한글, 영문, 숫자" 
            size="large"
          >
            <template #append>
              <el-button 
                class="action-btn" 
                type="primary" 
                size="large" 
                native-type="submit" 
                :loading="isLoading"
                :disabled="isLoading"
              >
                수정
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import api from '@/api/axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const formRef = ref();
const isLoading = ref(false);

const form = reactive({
  nickname: '',
});

// Load current nickname on component mount
onMounted(() => {
  if (authStore.user && authStore.user.nickname) {
    form.nickname = authStore.user.nickname;
  }
});

const rules = reactive({
  nickname: [
    { required: true, message: '닉네임을 입력해주세요.', trigger: 'blur' },
    { min: 2, max: 10, message: '2~10자 이내로 입력해주세요.', trigger: 'blur' },
    { pattern: /^[가-힣A-Za-z0-9]+$/, message: '특수문자와 공백은 사용할 수 없습니다.', trigger: 'blur' }
  ],
});

const handleNicknameChange = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      isLoading.value = true;
      try {
        const response = await api.patch('/api/v1/user/me/nickname', { newNickname: form.nickname });
        if (response.data.success) {
          ElNotification({ title: '성공', message: '닉네임이 성공적으로 변경되었습니다.', type: 'success' });
          // Optionally update the auth store with the new nickname
          // This requires the backend to return updated user info or a specific mechanism to update Pinia store.
          // For now, assume it's handled by subsequent token refresh or user re-fetch if needed.
          if (authStore.user) {
            authStore.user.nickname = form.nickname; // Optimistic update
          }
        } else {
          ElNotification({ title: '오류', message: response.data.message || '닉네임 변경 실패', type: 'error' });
        }
      } catch (error) {
        ElNotification({ title: '오류', message: error.response?.data?.message || '닉네임 변경 중 오류 발생', type: 'error' });
      } finally {
        isLoading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.mypage-section {
  margin-bottom: 50px;
}
.form-wrapper {
  max-width: 500px;
  margin: 0 auto; /* Center the container */
}
.section-title {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
.nickname-field {
  display: flex;
  gap: 10px;
}
.action-btn {
  background-color: #ffc933;
  border-color: #ffc933;
  font-weight: bold;
}
:deep(.el-form-item__label) {
  color: white !important;
}
/* .error-message is now handled by ElForm-Item default error message */
</style>
