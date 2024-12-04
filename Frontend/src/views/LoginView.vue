<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">Login</h1>
      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Account:</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Enter your username"
              class="input-field"
              required
          />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="btn login-btn">Login</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref('');
const password = ref('');

function login() {
  console.log('Login button clicked')
  axios.post('/api/login', {
    username: username.value,
    password: password.value
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    router.push('/')
  }).catch((error) => {
    console.log(error);
  });
}
</script>

<style scoped>
/* 全局容器樣式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 登入卡片樣式 */
.login-card {
  background-color: #ffffff;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

/* 登入標題樣式 */
.login-title {
  text-align: center;
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* 表單樣式 */
.login-form {
  display: flex;
  flex-direction: column;
}

/* 表單組樣式 */
.form-group {
  margin-bottom: 20px;
}

/* 標籤樣式 */
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 1rem;
  color: #34495e;
}

/* 輸入框樣式 */
.input-field {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #3498db;
  outline: none;
}

/* 按鈕樣式 */
.btn {
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;
}

/* 登入按鈕特定樣式 */
.login-btn {
  background-color: #3498db;
}

.login-btn:hover {
  background-color: #2980b9;
}

/* 響應式調整 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 2rem;
  }
}
</style>
