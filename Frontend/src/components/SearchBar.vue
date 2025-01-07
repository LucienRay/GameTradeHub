<template>
    <div class="search-bar-container">
      <button class="search-bar-button" @click="goToHome">首頁</button>
      <button class="search-bar-button">我的訂單</button>
      <button class="search-bar-button">訂單管理</button>
      <button class="search-bar-button" @click="userCenter">個人資料</button>
    </div>
</template>

<script setup lang="ts">
import { onMounted ,ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const isAuthenticated = ref(false);

function auth(){
  // 驗證用戶登入狀態
  axios.post('/api/auth')
      .then(() => {
        axios.post('/api/get/userINFO')
            .then(response => {
              isAuthenticated.value = true;
            })
            .catch(() => {
              isAuthenticated.value = false;
            });
      })
      .catch(() => {
        isAuthenticated.value = false; // 如果驗證失敗
      });
};

function goToHome() {
  // Navigate to HomeView (make sure your router is configured correctly)
  router.push("/home");
}

function userCenter() {
  // Navigate to UserCenterView (make sure your router is configured correctly)
  auth();
  if(isAuthenticated.value)
    router.push("/userCenter");
} 
</script>

<style scoped>
.search-bar-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin-left: 15%; 
  margin-top: 15px;
  background: linear-gradient(90deg, rgba(62, 103, 150, 0.919) 11.38%, rgba(58, 120, 177, 0.8) 25.23%, rgb(15, 33, 110) 100%);
  height: 35px;
  width: 70%;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.search-bar-button {
  margin: 5px;
  background: none;
  border: none;
  padding: 10px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #efefef;
  transition: color 0.3s;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.search-bar-button:hover {
  color: #007bff; 
}
</style>
