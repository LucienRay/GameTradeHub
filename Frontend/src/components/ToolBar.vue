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
      Hi {{ Nickname }}!
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const Nickname = ref('');
const isAuthenticated = ref(false);
const isAdmin = ref(false);
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
            isAdmin.value = false;
            router.push('/');
          })
          .catch(() => {
            console.log('Logout failed');
          });
    },
    condition: () => isAuthenticated.value, // 只有已登入時顯示
  },
  {
    label: "購物車",
    tooltip: "購物車",
    icon: "fa fa-plus",
    action: () => {
      router.push('/cart');
    },
    condition: () => isAuthenticated.value, // 只有已登入時顯示
  },
  {
    label: "上架商品",
    tooltip: "上架商品",
    icon: "fa fa-plus",
    action: () => {
      router.push('/listItem');
    },
    condition: () => isAuthenticated.value, // 只有已登入時顯示
  },
  {
    label: "管理",
    tooltip: "管理",
    icon: "fa fa-plus",
    action: () => {
      router.push('/admin');
    },
    condition: () => isAdmin.value, // 只有已登入時顯示
  },
// {
//   label: "|",
//   tooltip: "保存進度",
//   icon: "fa fa-save",
//   action: () => alert("保存成功"),
// },
// {
//   label: "幫助",
//   tooltip: "查看幫助",
//   icon: "fa fa-question-circle",
//   action: () => alert("這是幫助內容"),
// },
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
  axios.post('/api/auth/admin')
      .then(response => {
        isAdmin.value = true;
      })
      .catch(() => {
        isAdmin.value = false;
      });
});
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
