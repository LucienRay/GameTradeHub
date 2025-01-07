<template>
  <div class="orders-container">
    <h1>訂單列表</h1>

    <!-- 篩選按鈕 -->
    <div class="filter-buttons">
      <button @click="filterOrders('buyer')" :class="{ active: filterType === 'buyer' }">
        我是買家
      </button>
      <button @click="filterOrders('seller')" :class="{ active: filterType === 'seller' }">
        我是賣家
      </button>
    </div>

    <!-- 狀態篩選器 -->
    <div class="status-filter">
      <label for="status">訂單狀態：</label>
      <select id="status" v-model="selectedStatus" @change="filterOrdersByStatus">
        <option value="">所有狀態</option>
        <option value="1">處理中</option>
        <option value="2">已完成</option>
        <option value="3">已取消</option>
      </select>
    </div>

    <!-- 訂單內容 -->
    <div v-if="loading" class="loading">資料加載中...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <table v-else class="orders-table">
      <thead>
      <tr>
        <th>訂單編號</th>
        <th>日期</th>
        <th>狀態</th>
        <th>付款方式</th>
        <th>付款狀態</th>
        <th>賣家</th>
        <th>買家</th>
        <th>商品編號</th>
        <th>數量</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in filteredOrders" :key="order.ID">
        <td>{{ order.ID }}</td>
        <td>{{ order.Date }}</td>
        <td>{{ getStatus(order.State) }}</td>
        <td>{{ order.Payment_Method }}</td>
        <td>{{ order.Payment_State }}</td>
        <td>{{ order.Seller_ID }}</td>
        <td>{{ order.Buyer_ID }}</td>
        <td>{{ order.Item_ID }}</td>
        <td>{{ order.Quantity }}</td>
        <td v-if="order.State === 1">
          <button class="btn-complete" @click="markAsComplete(order.ID)">完成</button>
          <button class="btn-cancel" @click="cancelOrder(order.ID)">取消</button>
        </td>
        <td v-else>--</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";

// 定義 Order 型別
interface Order {
  ID: number;
  Date: string;
  State: number;
  Payment_Method: string;
  Payment_State: string;
  Seller_ID: string;
  Buyer_ID: string;
  Item_ID: number;
  Quantity: number;
}

// 定義變數
const orders = ref<Order[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const filterType = ref<string>("buyer"); // 預設為 "我是買家"
const selectedStatus = ref<string>(""); // 訂單狀態篩選
const currentUser = ref<string>(""); // 當前登入的使用者 ID

// 訂單狀態轉換
const getStatus = (state: number): string => {
  switch (state) {
    case 1:
      return "處理中";
    case 2:
      return "已完成";
    case 3:
      return "已取消";
    default:
      return "未知";
  }
};

// 過濾訂單
const filteredOrders = computed(() => {
  let filtered = orders.value;

  // 根據篩選類型篩選
  if (filterType.value === "buyer") {
    filtered = filtered.filter((order) => order.Buyer_ID === currentUser.value);
  } else if (filterType.value === "seller") {
    filtered = filtered.filter((order) => order.Seller_ID === currentUser.value);
  }

  // 根據狀態篩選
  if (selectedStatus.value) {
    filtered = filtered.filter((order) => order.State.toString() === selectedStatus.value);
  }

  return filtered;
});

// 切換篩選類型
const filterOrders = (type: string) => {
  filterType.value = type;
  console.log(`目前篩選為：${type === "buyer" ? "我是買家" : "我是賣家"}`);
};

// 狀態篩選功能
const filterOrdersByStatus = () => {
  console.log(`目前篩選的訂單狀態是：${selectedStatus.value || "所有狀態"}`);
};

// 標記訂單為完成
const markAsComplete = async (orderID: number) => {
  try {
    await axios.post(`/api/orders/complete`, { orderID });
    const order = orders.value.find((o) => o.ID === orderID);
    if (order) order.State = 2; // 更新本地狀態為已完成
    console.log(`訂單 ${orderID} 已標記為完成`);
  } catch (err) {
    console.error("無法標記為完成：", err);
    alert("無法標記訂單為完成，請稍後再試！");
  }
};

// 取消訂單
const cancelOrder = async (orderID: number) => {
  try {
    await axios.post(`/api/orders/cancel`, { orderID });
    const order = orders.value.find((o) => o.ID === orderID);
    if (order) order.State = 3; // 更新本地狀態為已取消
    console.log(`訂單 ${orderID} 已取消`);
  } catch (err) {
    console.error("無法取消訂單：", err);
    alert("無法取消訂單，請稍後再試！");
  }
};

// 載入訂單資料
onMounted(async () => {
  loading.value = true;
  try {
    // 獲取當前使用者資訊
    const userResponse = await axios.post("/api/get/userINFO");
    currentUser.value = userResponse.data.ID;

    // 獲取訂單資料
    const response = await axios.post("/api/get/orders");
    orders.value = response.data as Order[];
    console.log("訂單資料加載成功：", orders.value);
  } catch (err) {
    error.value = "無法加載訂單資料";
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.orders-container {
  padding: 20px;
  background: linear-gradient(180deg, #2A475E, #1B2838);
  color: #c7d5e0;
  font-family: Arial, sans-serif;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-buttons button {
  padding: 10px 20px;
  margin: 0 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filter-buttons button.active {
  background-color: #007bff;
}

.filter-buttons button:hover {
  background-color: #0056b3;
}

.status-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-filter label {
  margin-right: 10px;
  font-size: 16px;
}

.status-filter select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.orders-table th,
.orders-table td {
  padding: 10px;
  text-align: center;
  border: 1px solid #3b4149;
}

.orders-table th {
  background-color: #4a90e2;
  color: white;
}

.orders-table td {
  background-color: #1b2838;
  color: #c7d5e0;
}

.loading,
.error {
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
}

.btn-complete {
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-complete:hover {
  background-color: #218838;
}

.btn-cancel {
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #c82333;
}
</style>
