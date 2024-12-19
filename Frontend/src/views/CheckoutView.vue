<template>
  <div class="checkout-page">
    <h1>結帳</h1>

    <!-- 商品清單區 -->
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

    <!-- 訂單小計 -->
    <div class="order-summary">
      <div class="summary-item">
        <span>小計</span>
        <span>NT$ {{ formatPrice(subtotal) }}</span>
      </div>
      <div class="summary-item">
        <span>運費</span>
        <span>NT$ {{ formatPrice(shippingFee) }}</span>
      </div>
      <div class="summary-item total">
        <span>總計</span>
        <span>NT$ {{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <!-- 收件人資訊 -->
    <div class="shipping-address">
      <h2>收件資訊</h2>
      <div class="form-group">
        <label for="receiverName">收件人姓名</label>
        <input id="receiverName" v-model="shippingInfo.name" placeholder="請輸入收件人姓名"/>
      </div>
      <div class="form-group">
        <label for="receiverPhone">聯絡電話</label>
        <input id="receiverPhone" v-model="shippingInfo.phone" placeholder="請輸入聯絡電話"/>
      </div>
      <div class="form-group">
        <label for="receiverAddress">收貨地址</label>
        <input id="receiverAddress" v-model="shippingInfo.address" placeholder="請輸入收貨地址"/>
      </div>
    </div>

    <!-- 提交訂單按鈕 -->
    <div class="checkout-actions">
      <button @click="submitOrder" :disabled="isLoading">
        {{ isLoading ? '提交中...' : '提交訂單' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const cartItems = ref([
  { id: 1, name: '遊戲 A', price: 1200, quantity: 1 },
  { id: 2, name: '遊戲 B', price: 800, quantity: 2 }
])

const shippingInfo = ref({
  name: '',
  phone: '',
  address: ''
})

const selectedShipping = ref('standard')
const selectedPayment = ref('creditCard')

const creditCard = ref({
  number: '',
  expiry: '',
  cvc: ''
})

const isLoading = ref(false)

const shippingFee = computed(() => {
  return selectedShipping.value === 'express' ? 120 : 60
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalPrice = computed(() => {
  return subtotal.value + shippingFee.value
})

function formatPrice(value: number): string {
  return value.toFixed(0)
}

async function submitOrder() {
  try {
    isLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('訂單已提交成功！')
  } catch (error) {
    console.error(error)
    alert('提交訂單時發生錯誤，請稍後再試。')
  } finally {
    isLoading.value = false
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

.product-item:not(:last-child) {
  margin-bottom: 10px;
}

.product-name {
  font-weight: bold;
  margin-right: 10px;
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

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #c7d5e0;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 5px;
  background: #2a2f37;
  border: 1px solid #3b4149;
  color: #c7d5e0;
  border-radius: 3px;
}

.form-group input::placeholder {
  color: #8a9096;
}

.shipping-address,
.shipping-method,
.payment-method,
.credit-card-info {
  margin-bottom: 20px;
}

.shipping-method h2,
.payment-method h2,
.credit-card-info h2 {
  margin-bottom: 10px;
}

.radio-label {
  color: #c7d5e0;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
}

.radio-label input {
  margin-right: 8px;
  accent-color: #66c0f4;
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
