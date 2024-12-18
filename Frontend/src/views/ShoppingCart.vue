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
  import { ref, computed } from 'vue';

  interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
    seller: string;
  }

  const cartItems = ref<CartItem[]>([
    { id: 1, name: '商品 A', price: 100, quantity: 1, image: 'link_to_image_a', seller: 'seller1' },
    { id: 2, name: '商品 B', price: 200, quantity: 2, image: 'link_to_image_b', seller: 'seller2' },
    { id: 3, name: '商品 C', price: 300, quantity: 3, image: 'link_to_image_c', seller: 'seller3' },
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
  color: #ffffff;  /* 替換為你想要的顏色 */
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
