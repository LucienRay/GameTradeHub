<template>
  <div class="cart-container">
    <h1>購物車</h1>
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>您的購物車是空的。</p>
    </div>
    <div v-else>
      <div v-for="item in cartItems" :key="item.id" class="cart-item">
        <img :src="item.image" alt="product image" class="product-image" />
        <div class="item-details">
          <h2>{{ item.name }}</h2>
          <p>價格: {{ item.price }} 元</p>
          <div class="quantity-control">
            <button @click="decreaseQuantity(item)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)">+</button>
          </div>
          <button @click="removeItem(item)" class="remove-button">移除</button>
        </div>
      </div>
      <div class="total-price">
        <h3>總價格: {{ totalPrice }} 元</h3>
      </div>
      <button @click="checkout" class="checkout-button">結帳</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }

  const cartItems = ref<CartItem[]>([
    { id: 1, name: '商品 A', price: 100, quantity: 1, image: 'link_to_image_a' },
    { id: 2, name: '商品 B', price: 200, quantity: 2, image: 'link_to_image_b' },
  ]);

  const totalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
  });

  function increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  function decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  function removeItem(item: CartItem) {
    cartItems.value = cartItems.value.filter(i => i.id !== item.id);
  }

  function checkout() {
    alert('結帳功能尚未實現。');
  }
</script>

<style scoped>
.cart-container {
  background: linear-gradient(180deg, #2A475E, #1B2838);
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
}

h1 {
  text-align: center;
}

.empty-cart {
  text-align: center;
}

.cart-item {
  display: flex;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #fff;
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
}

.quantity-control button {
  margin: 0 5px;
}

.remove-button {
  background-color: red;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
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
}
</style>
