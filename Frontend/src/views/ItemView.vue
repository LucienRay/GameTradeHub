<template>
<div class="container">
    <ToolBar class="toolbar" />
    <SearchBar class="search-bar" />
    <div class="item-info-container">
        <div class="info">
            <div class="title">{{itemInfo?.Title}}</div>
            <img :src="itemInfo?.path" />
            <div class="description">{{itemInfo?.Description}}</div>
            <div class="price">Price: ${{ itemInfo?.Price }}</div>
            <button class="add-to-cart">加入購物車</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {ref,onMounted} from "vue";
import axios from "axios";

interface ItemInfo {
  Title: string;
  Price: number;
  Quantity: number;
  Description: string;
  Seller_ID: string;
  Game_ID: string;
  path: string;
}

const route = useRoute();
const itemID = route.params.ID;
const itemInfo = ref<ItemInfo | null>(null);


onMounted(() => {
    axios.post('/api/get/ItemINFO', {ID: itemID}).then(response => {
      itemInfo.value = response.data as ItemInfo; // 顯式轉換型態
      console.log(itemInfo.value);
    }).catch(error => {
      console.log(error);
    });
});
</script>

<style scoped>
.container {
  background: linear-gradient(180deg, #2A475E, #1B2838);
  height: 100vh;
  width: 100%;
  margin: 0;
  justify-content: center;
  align-items: center;
}

.item-info-container {
    background: linear-gradient(180deg, rgba(62, 103, 150, 0.919) 11.38%, rgba(58, 120, 177, 0.8) 25.23%, rgb(15, 33, 110) 100%);
    width: 70%;
    height: 80%;
    margin-left: 15%;
    margin-top: 35px;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
    
}

.info {
    padding: 1% ;
    color: white
}

.title {
    color: white;
    font-size: 36px;
    font-weight: bold;
    
}
.add-to-cart {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2593d2;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.description {
    font-size: 24px;
}

.price{
    font-size: 24px;
    font-weight: bold;
}

.add-to-cart:hover {
  background-color: #4A9BD6;
}

img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>