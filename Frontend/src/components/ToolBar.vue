<template>
  <div class="toolbar">
    <button
        v-for="tool in tools.filter(tool => tool.condition())"
        :key="tool.label"
        :title="tool.tooltip"
        @click="tool.action"
        class="toolbar-button"
    >
      <i :class="tool.icon"></i> {{ tool.label }}
    </button>
    <p v-if="isAuthenticated" class="nickname">
      Hi
      <button @click="handleNicknameClick" class="nickname-button">{{ Nickname }}</button>!
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const Nickname = ref('');
const isAuthenticated = ref(false);
const router = useRouter();

// 定義工具按鈕數據
const tools = ref([
  {
    label: "登入",
    tooltip: "登入",
    icon: "fa fa-plus",
    action: () => {
      router.push('/login');
    },
    condition: () => !isAuthenticated.value, // 只有未登入時顯示
  },
  {
    label: "登出",
    tooltip: "登出",
    icon: "fa fa-plus",
    action: () => {
      axios.post('/api/logout')
          .then(() => {
            isAuthenticated.value = false;
            router.push('/');
          })
          .catch(() => {
            console.log('Logout failed');
          });
    },
    condition: () => isAuthenticated.value, // 只有已登入時顯示
  },
]);

onMounted(() => {
  // 驗證用戶登入狀態
  axios.post('/api/auth')
      .then(() => {
        axios.post('/api/get/userINFO')
            .then(response => {
              Nickname.value = response.data.Nickname;
              isAuthenticated.value = true;
            })
            .catch(() => {
              isAuthenticated.value = false;
            });
      })
      .catch(() => {
        isAuthenticated.value = false; // 如果驗證失敗
      });
});

// 點擊暱稱的事件處理
const handleNicknameClick = () => {
  router.push('/userCenter');
};
</script>

<style scoped>
.toolbar {
  background-color: #171a21;
  display: flex;
  flex-direction: row-reverse;
  gap: 10px;
  padding: 5px 100px;
}
.toolbar-button {
  background: none;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  color: #b8b6b4;
  cursor: pointer;
  transition: color 0.3s;
}

.toolbar-button:hover {
  color: #007bff;
}

.toolbar-button i {
  font-size: 16px;
}

.nickname {
  display: flex;
  align-items: center;
  color: #b8b6b4;
  font-size: 14px;
}

.nickname-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: inherit;
  cursor: pointer;
  padding: 0;
  margin-left: 5px;
  transition: color 0.3s;
}

.nickname-button:hover {
  color: #00bfff;
}
</style>
