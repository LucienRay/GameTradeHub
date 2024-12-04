<template>
  <div class="container">
    <h1 class="title">Home</h1>
    <p class="welcome">Welcome to the Home page</p>

    <div v-if="isAuthenticated" class="auth-section">
      <h2 class="subtitle">這是只有登入後才會看到的畫面</h2>
      <p class="greeting">歡迎回來，{{ Nickname }}！</p>
      <button class="btn logout-btn" @click="logout">Logout</button>
    </div>

    <div v-else class="auth-buttons">
      <router-link to="/login">
        <button class="btn primary-btn">Login</button>
      </router-link>
      <router-link to="/register">
        <button class="btn secondary-btn">Register</button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
const Nickname = ref('');
const isAuthenticated = ref(false);

onMounted(() => {
  // 驗證用戶登入狀態
  axios.post('/api/auth')
      .then(response => {
        axios.post('/api/get/userINFO').then(response => {
          console.log(response.data);
          Nickname.value = response.data.Nickname;
          isAuthenticated.value = true;
        }).catch(error => {
          isAuthenticated.value = false;
          console.log(error);
        });
      })
      .catch(() => {
        isAuthenticated.value = false; // 如果驗證失敗
      });
});

function logout() {
  axios.post('/api/logout')
      .then(() => {
        isAuthenticated.value = false;
      })
      .catch(() => {
        console.log('Logout failed');
      });
}
</script>

<style scoped>
/* 全局容器樣式 */
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 標題樣式 */
.title {
  font-size: 3rem;
  color: #333;
  margin-bottom: 10px;
}

/* 歡迎文字樣式 */
.welcome {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 30px;
}

/* 認證區塊樣式 */
.auth-section {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 15px;
}

.greeting {
  font-size: 1.2rem;
  color: #34495e;
  margin-bottom: 25px;
}

/* 按鈕樣式 */
.btn {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin: 5px;
}

.primary-btn {
  background-color: #3498db;
  color: #fff;
}

.primary-btn:hover {
  background-color: #2980b9;
}

.secondary-btn {
  background-color: #2ecc71;
  color: #fff;
}

.secondary-btn:hover {
  background-color: #27ae60;
}

.logout-btn {
  background-color: #e74c3c;
  color: #fff;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* 認證按鈕容器樣式 */
.auth-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* 調整 router-link 內按鈕的樣式 */
.router-link {
  text-decoration: none;
}
</style>
