<template>
  <div class="container">
    <!-- 導航欄 -->
    <nav class="navbar">
      <div class="logo">
        <router-link to="/">MyApp</router-link>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/about">About</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/profile">Profile</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/settings">Settings</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/login">Login</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">Register</router-link></li>
      </ul>
    </nav>

    <!-- 英雄區塊 -->
    <section class="hero">
      <h1>Welcome to MyApp</h1>
      <p>Your gateway to awesome features.</p>
      <router-link to="/register" tag="button" class="btn hero-btn">
        Get Started
      </router-link>
    </section>

    <!-- 主要內容 -->
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

    <!-- 功能介紹卡片 -->
    <div class="features">
      <div class="feature-card">
        <h3>Feature One</h3>
        <p>這是第一個功能的描述。</p>
      </div>
      <div class="feature-card">
        <h3>Feature Two</h3>
        <p>這是第二個功能的描述。</p>
      </div>
      <div class="feature-card">
        <h3>Feature Three</h3>
        <p>這是第三個功能的描述。</p>
      </div>
    </div>

    <!-- 用戶活動區塊 -->
    <div v-if="isAuthenticated" class="user-stats">
      <h2>Your Activity</h2>
      <div class="stats-cards">
        <div class="stats-card">
          <h3>Posts</h3>
          <p>10</p>
        </div>
        <div class="stats-card">
          <h3>Followers</h3>
          <p>200</p>
        </div>
        <div class="stats-card">
          <h3>Following</h3>
          <p>180</p>
        </div>
      </div>
    </div>

    <!-- 頁腳 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2024 MyApp. All rights reserved.</p>
        <div class="social-links">
          <a href="https://facebook.com" target="_blank">Facebook</a>
          <a href="https://twitter.com" target="_blank">Twitter</a>
          <a href="https://instagram.com" target="_blank">Instagram</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 導航欄樣式 */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #34495e;
  padding: 15px 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.logo a {
  color: #ecf0f1;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
}

.nav-links li a {
  color: #ecf0f1;
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.nav-links li a:hover {
  color: #bdc3c7;
}

/* 英雄區塊樣式 */
.hero {
  background: url('/path-to-your-image.jpg') center center/cover no-repeat;
  color: #ffffff;
  padding: 100px 20px;
  text-align: center;
  border-radius: 12px;
  position: relative; /* 確保子元素的 z-index 生效 */
  margin-bottom: 40px;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  pointer-events: none; /* 允許滑鼠事件穿透 */
  z-index: 0; /* 確保遮罩層在背景 */
}

/* Hero 區塊內的內容樣式 */
.hero > * {
  position: relative;
  z-index: 1; /* 確保按鈕和文字在遮罩層之上 */
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

/* 按鈕樣式 */
.hero-btn {
  background-color: #e67e22;
  z-index: 2; /* 確保按鈕在更高的層級 */
  text-decoration: none; /* 移除底線 */
}

.hero-btn:hover {
  background-color: #d35400;
  transform: translateY(-2px);
}

/* 通用按鈕樣式 */
.btn {
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  color: #fff;
}

.primary-btn {
  background-color: #3498db;
}

.primary-btn:hover {
  background-color: #2980b9;
}

.secondary-btn {
  background-color: #2ecc71;
}

.secondary-btn:hover {
  background-color: #27ae60;
}

.logout-btn {
  background-color: #e74c3c;
}

.logout-btn:hover {
  background-color: #c0392b;
}

/* 功能介紹卡片樣式 */
.features {
  display: flex;
  justify-content: space-around;
  margin: 40px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.feature-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.feature-card h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature-card p {
  color: #7f8c8d;
}

/* 用戶活動區塊樣式 */
.user-stats {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.user-stats h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.stats-cards {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  flex-wrap: wrap;
}

.stats-card {
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
  width: 150px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.stats-card h3 {
  color: #34495e;
  margin-bottom: 10px;
}

.stats-card p {
  font-size: 1.5rem;
  color: #2c3e50;
}

/* 頁腳樣式 */
.footer {
  text-align: center;
  padding: 20px;
  background-color: #34495e;
  color: #ecf0f1;
  border-radius: 8px;
  margin-top: 40px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.footer-content p {
  margin: 0;
  color: #ecf0f1;
}

.social-links a {
  color: #ecf0f1;
  margin: 0 10px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #bdc3c7;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .features, .stats-cards {
    flex-direction: column;
    align-items: center;
  }

  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    flex-direction: column;
    gap: 10px;
  }

  .footer-content {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
