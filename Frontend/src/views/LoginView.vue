<template>
  <ToolBar class="toolbar"/>
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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="btn login-btn">Login</button>
      </form>
    </div>
    <div class="signup-container">
      <h2 class="signup-title">初次使用我們的交易平台？</h2>
      <p class="signup-text">
        免費加入，探索海量虛寶交易，並與眾多玩家建立聯繫，享受安全高效的交易體驗！
      </p>
      <button class="btn signup-btn" @click="register">建立帳戶</button>
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
const errorMessage = ref('');

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
    errorMessage.value = ''; // 清除錯誤訊息
    router.push('/');
  }).catch((error) => {
    console.log(error);
    errorMessage.value = '帳號或密碼錯誤'; // 設定錯誤訊息
  });
}

function register() {
  router.push('/register');
}

</script>

<style scoped>
/* 全局容器樣式 */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b2838, #2a475e);
  font-family: 'Arial', sans-serif;
  color: #c7d5e0;
}

/* 登入卡片樣式 */
.login-card {
  background-color: #1b2838;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
}

/* 登入標題樣式 */
.login-title {
  text-align: center;
  font-size: 2.5rem;
  color: #c7d5e0;
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
  color: #c7d5e0;
}

/* 輸入框樣式 */
.input-field {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #3c4f64;
  border-radius: 6px;
  background-color: #16202d;
  color: #c7d5e0;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #66c0f4;
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
  background-color: #66c0f4;
}

.login-btn:hover {
  background-color: #417a9b;
}

/* 註冊相關樣式 */
.signup-container {
  text-align: center;
  max-width: 400px;
  color: #c7d5e0;
}

.signup-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.signup-text {
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.signup-link {
  color: #66c0f4;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.signup-btn {
  background-color: #5caa47;
}

.signup-btn:hover {
  background-color: #4b8a3c;
}

/* 響應式調整 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 2rem;
  }

  .signup-container {
    padding: 10px;
  }

  .signup-title {
    font-size: 1.2rem;
  }

  .signup-text {
    font-size: 0.8rem;
  }
}

.error-message {
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 20px;
  text-align: center;
}


</style>