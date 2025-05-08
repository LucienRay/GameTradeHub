<template>
  <ToolBar class="toolbar"/>
  <div class="register-container">
    <div class="register-card">
      <h1 class="register-title">Register</h1>
      <form @submit.prevent="register" class="register-form">
        <!-- Username -->
        <div class="form-group">
          <label for="username">Username</label>
          <input
              type="text"
              id="username"
              v-model="username"
              placeholder="Enter your username"
              class="input-field"
              required
          />
          <p v-if="errors.username" class="errorHint">
            Username must contain at least 8 characters and at most 20 characters.
          </p>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
              type="password"
              id="password"
              v-model="password"
              placeholder="Enter your password"
              class="input-field"
              required
          />
          <p v-if="errors.password" class="errorHint">
            Password must contain at least 8 characters, including uppercase, lowercase letters, numbers, and special characters.
          </p>
        </div>

        <!-- SSN -->
        <div class="form-group">
          <label for="ssn">SSN</label>
          <input
              type="text"
              id="ssn"
              v-model="ssn"
              placeholder="Enter your SSN"
              class="input-field"
              required
          />
          <p v-if="errors.ssn" class="errorHint">SSN is not valid.</p>
        </div>

        <!-- Nickname -->
        <div class="form-group">
          <label for="nickname">Nickname</label>
          <input
              type="text"
              id="nickname"
              v-model="nickname"
              placeholder="Enter your nickname"
              class="input-field"
              required
          />
          <p v-if="errors.nickname" class="errorHint">Nickname should not be empty.</p>
        </div>

        <!-- Phone -->
        <div class="form-group">
          <label for="phone">Phone</label>
          <input
              type="text"
              id="phone"
              v-model="phone"
              placeholder="Enter your phone number"
              class="input-field"
              required
          />
          <p v-if="errors.phone" class="errorHint">Phone is not valid.</p>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email">Email</label>
          <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Enter your email"
              class="input-field"
              required
          />
          <p v-if="errors.email" class="errorHint">Email is not valid.</p>
        </div>

        <button type="submit" class="btn register-btn">Register</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const username = ref('');
const password = ref('');
const ssn = ref('');
const nickname = ref('');
const phone = ref('');
const email = ref('');
const router = useRouter();
const errors = ref({
  username: false,
  password: false,
  ssn: false,
  nickname: false,
  phone: false,
  email: false,
});

function register() {
  console.log('Register button clicked')
  if(username.value === '' || password.value === '' || ssn.value === '' || nickname.value === '' || phone.value === '' || email.value === '') {
    alert('Please fill in all fields');
    return;
  }
  axios.post('/api/register', {
    username: username.value,
    password: password.value,
    ssn: ssn.value,
    nickname: nickname.value,
    phone: phone.value,
    email: email.value
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((response) => {
    console.log(response.data);
    router.push('/')
  }).catch((error) => {
    const errorResponse = error.response.data.validationResults;
    errors.value.username = !errorResponse.username;
    errors.value.password = !errorResponse.password;
    errors.value.ssn = !errorResponse.ssn;
    errors.value.nickname = !errorResponse.nickname;
    errors.value.phone = !errorResponse.phone;
    errors.value.email = !errorResponse.email;
  });
}
</script>

<style scoped>
/* 全局容器樣式 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1b2838, #2a475e);
  font-family: 'Arial', sans-serif;
  color: #c7d5e0;
}

/* 註冊卡片樣式 */
.register-card {
  background-color: #1b2838;
  padding: 40px 30px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
}

/* 註冊標題樣式 */
.register-title {
  text-align: center;
  font-size: 2.5rem;
  color: #c7d5e0;
  margin-bottom: 30px;
}

/* 表單樣式 */
.register-form {
  display: flex;
  flex-direction: column;
}

/* 表單組樣式 */
.form-group {
  margin-bottom: 20px;
  position: relative;
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
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.input-field:focus {
  border-color: #66c0f4;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  outline: none;
}

/* 錯誤提示樣式 */
.errorHint {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
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

/* 註冊按鈕特定樣式 */
.register-btn {
  background-color: #5caa47;
}

.register-btn:hover {
  background-color: #4b8a3c;
}

/* 響應式調整 */
@media (max-width: 600px) {
  .register-card {
    padding: 30px 20px;
  }

  .register-title {
    font-size: 2rem;
  }

  .input-field {
    padding: 10px 12px;
  }

  .btn {
    padding: 10px 18px;
    font-size: 0.9rem;
  }
}
</style>