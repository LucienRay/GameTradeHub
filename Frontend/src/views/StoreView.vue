<template>
  <div class="container">
      <ToolBar class="toolbar"/>
      <SearchBar class="search-bar"/>
      <DataList :list="dataList"></DataList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const Nickname = ref('');
const isAuthenticated = ref(false);
let dataList = ref([{ Name: '', Seller: '', Price: 0, Quantity: 0}]);

onMounted(() => {
// 驗證用戶登入狀態
  axios.post('/api/auth')
    .then(response => {
      axios.post('/api/get/userINFO').then(response => {
        Nickname.value = response.data.Nickname;
        isAuthenticated.value = true;
      }).catch(error => {
        isAuthenticated.value = false;
      });
    })
    .catch(() => {
      isAuthenticated.value = false; // 如果驗證失敗
    });
  axios.post('/api/get/SimpleItemINFOs',{game:route.query.game}).then(response => {
    dataList.value = response.data;
  }).catch(error => {
    console.log(error);
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

function routeToItem(itemID: string) {
    alert(`Routing to ${itemID} `);
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

</style>