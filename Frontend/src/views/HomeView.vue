<template>
  <div class="container">
    <ToolBar class="toolbar" />
    <SearchBar class="search-bar" />
    <ChatWidget class="chatWidget" />
    <div class="grid-container">
      <div v-for="game in games" :key="game.Name" class="button-container">
        <img v-on:click="routeToGame(game.Name)" :src="game.Image" class="button-image" />
        <div class="button-text">{{ game.Name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from "vue-router";

const router = useRouter();

let games = ref([{ ID: 0, Name: '', Platform: '', Image: '' }]);

onMounted(() => {
  axios.post('/api/get/GameINFO').then(response => {
    games.value = response.data;
  }).catch(error => {
    console.log(error);
  });
});

function routeToGame(gameName: string) {
    // alert(`Routing to ${gameName} `);
  router.push({ path: '/store', query: { game: gameName } });
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