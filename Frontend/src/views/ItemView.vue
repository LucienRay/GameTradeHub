<template>
  <div class="container">
    <ToolBar class="toolbar" />
    <SearchBar class="search-bar" />
    <ChatWidget ref="chatWidget" class="chatWidget" />
    <div class="item-info-container">
      <div class="info">
        <div class="title">{{ itemInfo?.Title }}</div>
        <img :src="itemInfo?.path" />
        <div class="description">{{ itemInfo?.Description }}</div>
        <div class="price">Price: ${{ itemInfo?.Price }}</div>
        <div class="quantity">Available Quantity: {{ itemInfo?.Quantity }}</div>
        <div class="quantity-selector">
          <label for="quantity">Select Quantity:</label>
          <input
              id="quantity"
              type="number"
              v-model.number="selectedQuantity"
              :min="1"
              :max="itemInfo?.Quantity || 1"
          />
        </div>
        <button class="add-to-cart" @click="addToCart">加入購物車</button>
        <button class="chat-with-seller" @click="chatWithSeller">跟賣家聊天</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, onMounted } from "vue";
import axios from "axios";
import ChatWidget from "@/components/ChatWidget.vue";

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
const selectedQuantity = ref(1);

// 用來操作 ChatWidget 元件的方法
const chatWidgetRef = ref();

onMounted(() => {
  axios.post('/api/get/ItemINFO', { ID: itemID }).then(response => {
    itemInfo.value = response.data as ItemInfo;
    console.log(itemInfo.value);
  }).catch(error => {
    console.log(error);
  });
});

const addToCart = () => {
  if (selectedQuantity.value > 0 && itemInfo.value) {
    const cartItem = {
      ID: itemID,
      Quantity: selectedQuantity.value,
    };
    axios.post('/api/add/shoppingCart', cartItem).then(response => {
      console.log(response.data);
      alert('新增成功！');
    }).catch(error => {
      console.log(error);
      alert('新增失敗，請稍後再試！');
    });
  } else {
    console.error("無效的數量");
  }
};

const chatWithSeller = () => {
  if (itemInfo.value) {
    const sellerID = itemInfo.value.Seller_ID;
    const message = {
      sender: 'You',
      receiver: sellerID,
      content: "Hello! I'm interested in your item.",
      timestamp: new Date().toISOString(),
    };

    // 傳送訊息到後端 API
    axios.post('/api/add/messages', message)

  }
};
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
  padding: 1%;
  color: white;
}

.title {
  color: white;
  font-size: 36px;
  font-weight: bold;
}

.quantity-selector {
  margin: 10px 0;
  color: white;
  font-size: 18px;
}

.quantity-selector input {
  width: 60px;
  padding: 5px;
  font-size: 16px;
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

.chat-with-seller {
  margin-left: 10px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s;
}

.add-to-cart:hover {
  background-color: #4A9BD6;
}

.chat-with-seller:hover {
  background-color: #d68910;
}

.description {
  font-size: 24px;
}

.price {
  font-size: 24px;
  font-weight: bold;
}

img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  display: block;
  margin: 0 auto;
}
</style>
