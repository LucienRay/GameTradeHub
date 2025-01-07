<template>
  <div class="checkout-page">
    <h1>結帳</h1>

    <div class="product-list">
      <h2>您的訂單</h2>
      <ul>
        <li v-for="item in cartItems" :key="item.id" class="product-item">
          <div class="product-info">
            <span class="product-name">{{ item.name }}</span>
            <span class="product-quantity">數量：{{ item.quantity }}</span>
          </div>
          <div class="product-price">
            NT$ {{ formatPrice(item.price * item.quantity) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="coupon-selection">
      <h2>選擇優惠券</h2>
      <select v-model="selectedCoupon">
        <option value="" disabled>請選擇優惠券</option>
        <option
            v-for="coupon in coupons"
            :key="coupon.id"
            :value="coupon"
            :disabled="subtotal < coupon.Lowest_Price"
        >
          {{ coupon.Coupon_Type === 1
            ? `${coupon.Price_Discount}% 折扣`
            : `減 NT$ ${coupon.Price_Reduce}`
          }} - 最低消費: NT$ {{ coupon.Lowest_Price }}
        </option>
      </select>
    </div>

    <div class="order-summary">
      <div class="summary-item">
        <span>小計</span>
        <span>NT$ {{ formatPrice(subtotal) }}</span>
      </div>
      <div class="summary-item">
        <span>折扣</span>
        <span>NT$ {{ formatPrice(discount) }}</span>
      </div>
      <div class="summary-item total">
        <span>總計</span>
        <span>NT$ {{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <div class="checkout-actions">
      <button @click="submitOrder" :disabled="isLoading">
        {{ isLoading ? '提交中...' : '提交訂單' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import router from "@/router";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Coupon {
  id: string;
  Coupon_Type: number; // 1 = 百分比折扣, 2 = 固定金額減免
  Price_Discount: number | null;
  Price_Reduce: number | null;
  Lowest_Price: number;
}

const cartItems = ref<CartItem[]>([]);
const coupons = ref<Coupon[]>([]);
const selectedCoupon = ref<Coupon | null>(null);
const isLoading = ref(false);

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const discount = computed(() => {
  if (!selectedCoupon.value) return 0;

  if (selectedCoupon.value.Coupon_Type === 1) {
    // 百分比折扣
    return subtotal.value * (selectedCoupon.value.Price_Discount! / 100);
  } else if (selectedCoupon.value.Coupon_Type === 2) {
    // 固定金額減免
    return selectedCoupon.value.Price_Reduce!;
  }

  return 0;
});

const totalPrice = computed(() => {
  return Math.max(subtotal.value - discount.value, 0); // 確保總計不為負數
});

onMounted(() => {
  // 獲取購物車數據
  axios.post('/api/get/shoppingCart')
      .then((response) => {
        cartItems.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });

  // 獲取優惠券數據
  axios.post('/api/get/coupons', { userId: 'current_user_id' })
      .then((response) => {
        coupons.value = response.data;
      })
      .catch((error) => {
        console.error('Error fetching coupons:', error);
      });
});

function formatPrice(value: number): string {
  return value.toFixed(0);
}

async function submitOrder() {
  if (cartItems.value.length === 0) {
    alert('購物車是空的，無法提交訂單！');
    return;
  }

  if (selectedCoupon.value && subtotal.value < selectedCoupon.value.Lowest_Price) {
    alert(`選擇的優惠券需要最低消費 NT$ ${selectedCoupon.value.Lowest_Price}！`);
    return;
  }

  try {
    isLoading.value = true;

    const orderData = {
      items: cartItems.value.map((item) => ({
        id: item.id,
        quantity: item.quantity,
      })),
      coupon: selectedCoupon.value?.id || null,
      totalPrice: totalPrice.value,
    };

    await axios.post('/api/add/order', orderData);

    alert('訂單已提交成功！');
    router.push('/');
  } catch (error) {
    console.error('Error submitting order:', error);
    alert('提交訂單時發生錯誤，請稍後再試。');
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.checkout-page {
  background: linear-gradient(180deg, #2A475E, #1B2838);
  color: #c7d5e0;
  padding: 20px;
  font-family: "Segoe UI", "Roboto", sans-serif;
}

h1, h2 {
  margin-bottom: 15px;
  color: #66c0f4;
  font-weight: normal;
}

.product-list {
  margin-bottom: 20px;
}

.product-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  background: #2a2f37;
  border-radius: 4px;
}

.product-name {
  font-weight: bold;
  color: #c7d5e0;
}

.product-quantity {
  font-size: 14px;
  color: #b8bcbf;
}

.product-price {
  color: #c7d5e0;
  font-weight: bold;
}

.coupon-selection {
  margin-bottom: 20px;
}

.coupon-selection h2 {
  margin-bottom: 10px;
  color: #66c0f4;
}

.coupon-selection select {
  width: 100%;
  padding: 10px;
  border: 1px solid #3b4149;
  border-radius: 5px;
  background: #2a2f37;
  color: #c7d5e0;
  font-size: 16px;
}

.order-summary {
  border-top: 1px solid #3b4149;
  padding-top: 10px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.summary-item span {
  color: #c7d5e0;
}

.summary-item.total {
  font-weight: bold;
  font-size: 16px;
}

.checkout-actions {
  text-align: center;
}

button {
  padding: 10px 20px;
  background: #66c0f4;
  color: #1b1e26;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

button:disabled {
  background: #4f6b80;
  cursor: not-allowed;
}

button:hover:enabled {
  background: #67c1f5;
}
</style>
