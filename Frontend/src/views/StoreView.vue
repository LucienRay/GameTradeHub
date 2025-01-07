<template>
  <div class="container">
    <ToolBar class="toolbar"/>
    <SearchBar class="search-bar" />
    <ChatWidget class="chatWidget" />
    <div class="search-container">
      <input type="text" v-model="searchQuery" placeholder="搜尋內容..." class="search-input" />
    </div>
    <DataList :list="filteredData"></DataList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from "vue-router";
import SearchBar from "@/components/SearchBar.vue";

const route = useRoute();
const Nickname = ref('');
const isAuthenticated = ref(false);
const searchQuery = ref('');
let dataList = ref([{ ID: 0, Name: '', Seller: '', Price: 0, Quantity: 0 },]);

// 根據搜尋內容過濾資料
const filteredData = computed(() => {
  if (!searchQuery.value) return dataList.value;
  return dataList.value.filter(item =>
      Object.values(item).some(value =>
          value.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
});

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

  // 獲取初始資料列表
  axios.post('/api/get/SimpleItemINFOs', { game: route.query.game }).then(response => {
    dataList.value = response.data;
  }).catch(error => {
    console.log(error);
  });
});

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

.search-input {
  padding: 8px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
}
.search-container {
  display: flex; /* 使用 flexbox */
  justify-content: center; /* 水平置中 */
  width: 100%; /* 占滿容器寬度 */
}

</style>
