<template>
<div class="container">
    <ToolBar class="toolbar" />
    <SearchBar class="search-bar" />
    <div class="item-info-container">
        <div class="info">
            <div class="title">Title</div>
            <img src="https://via.placeholder.com/500x300"/>
            <div class="description">
            This is a detailed description of the item. It provides information about the features, materials, and any other relevant details.
            </div>
            <div class="price">Price: $99.99</div>
            <button class="add-to-cart">加入購物車</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const itemID = route.params.ID;
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
</style>