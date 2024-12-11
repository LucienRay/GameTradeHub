<template>
  <div class="container">
      <ToolBar class="toolbar"/>
      <SearchBar class="search-bar"/>
      <div class="grid-container">
          <div v-for="game in games" :key="game.name" class="button-container">
              <img v-on:click="routeToGame(game.name)" :src="game.imageSrc" class="button-image" />
              <div class="button-text">{{ game.name }}</div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";

const router = useRouter();
const Nickname = ref('');
const isAuthenticated = ref(false);
const games = ref([
{ name: 'Apex', imageSrc: '/public/ApexLogo.jpg' },
{ name: 'Cyberpunk 2077', imageSrc: '/public/ApexLogo.jpg' },
{ name: 'Elden Ring', imageSrc: '/public/ApexLogo.jpg' },
{ name: 'Counter-Strike 2', imageSrc: '/public/ApexLogo.jpg' },
{ name: 'Dota 2', imageSrc: '/public/ApexLogo.jpg' },
{ name: 'The Witcher 3', imageSrc: '/public/ApexLogo.jpg' }
]);

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

function routeToGame(gameName: string) {
    alert(`Routing to ${gameName} `);
    // router.push('/store')
}
</script>

<style scoped>
/* 全局容器樣式 */
.container {
  background: linear-gradient(180deg, #2A475E, #1B2838);
  height: 100vh;
  width: 100%;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.grid-container {
width: 70%;
margin-left: 15%;
display: flex;
flex-wrap: wrap;
}

.button-container {
margin-top: 35px;
flex: 0 0 25%;
width: 230px;
height: 120px;
position: relative;
transition: 0.3s;
}

.button-container:hover {
transform: translate(0, -10px);
}

.button-image {
object-fit: cover;
width: 220px;
height: 120px;
display: block;
filter: blur(4px);
border-radius: 25px;
}

.button-text {
position: absolute;
bottom: 65%;
left: 8%;
font-size: 24px; 
color: white;
text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8);
text-align: left;
font-weight: bold;
}
</style>