<template>
  <div>
    <h1>Home</h1>
    <p>Welcome to the Home page</p>

    <div v-if="isAuthenticated">
      <h2>這是只有登入後才會看到的畫面</h2>
      <p>歡迎回來，{{ Nickname }}！</p>
      <button @click="logout">Logout</button>
    </div>
    <div v-else>
      <button>
        <router-link to="/login">Login</router-link>
      </button>
      <button>
        <router-link to="/register">Register</router-link>
      </button>
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
</style>