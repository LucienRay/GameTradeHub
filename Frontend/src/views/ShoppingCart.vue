<template>
  <div class="cart-container">
    <h1>Shopping Cart</h1>
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Your shopping cart is empty</p>
    </div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="product image" class="product-image" />
        <div class="item-details">
          <h2>{{ item.name }}</h2>
          <p>{{ item.price }} 元</p>
          <div class="quantity-control">
            <button @click="decreaseQuantity(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)">+</button>
          </div>
          <div class="seller-container">
            <p>{{item.seller}}</p>
            <button @click="removeItem(item)" class="remove-button">移除</button>
          </div>
        </div>
      </div>
      <div class="total-container">
        <h3 class="total-price">總計: {{ totalPrice }} 元</h3>
        <button @click="checkout" class="checkout-button">結帳</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted} from 'vue';
import axios from "axios";
import router from "@/router";

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    seller: string;
  }

  const cartItems = ref<CartItem[]>([]);

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  function increaseQuantity(item: CartItem) {
    item.quantity++;
    axios.post('/api/update/shoppingCart', {id: item.id, quantity: item.quantity})
      .then(response => {
        console.log('Item quantity updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating item quantity:', error);
      });
  }

  function decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
      axios.post('/api/update/shoppingCart', {id: item.id, quantity: item.quantity})
          .then(response => {
            console.log('Item quantity updated:', response.data);
          })
          .catch(error => {
            console.error('Error updating item quantity:', error);
          });
    }
  }

  function removeItem(item: CartItem) {
    cartItems.value = cartItems.value.filter(i => i.id !== item.id);
    axios.post('/api/delete/shoppingCart', {id: item.id})
      .then(response => {
        console.log('Item removed:', response.data);
      })
      .catch(error => {
        console.error('Error removing item:', error);
      });
  }

  function checkout() {
    router.push('/checkout');
  }

  onMounted(() => {
    axios.post('/api/get/shoppingCart')
      .then(response => {
        cartItems.value = response.data;
        console.log( response.data);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
      });
  });

</script>

<style scoped>
.cart-container {
  background: linear-gradient(180deg, #2A475E, #1B2838);
  height: 100vh;
  width: 100%;
  margin: 0;
  justify-content: center;
  align-items: center;
}

h1 {
  text-align: center;
}

h1, h2, h3, p, a, span {
  color: #ffffff;
}

.empty-cart {
  text-align: center;
}

.cart-item {
  display: flex;
  margin: 20px 40px;
  padding: 10px;
  background-color: #405163e6;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 20px;
}

.item-details {
  flex: 1;
}

.quantity-control {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.quantity-control button {
  margin: 0 5px;
}

.seller-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-button {
  color: #b2b8bd;
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.total-container {
  margin: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-price {
  margin-top: 20px;
  text-align: right;
}

.checkout-button {
  background-color: green;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 40px;
}
</style>
