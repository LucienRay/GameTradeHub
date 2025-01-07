<template>
  <div class="admin-panel">
    <!-- 商品列表 -->
    <main class="content">
      <header class="content-header">
        <h2>我的商品管理</h2>
        <input
            type="text"
            v-model="searchQuery"
            placeholder="搜尋商品..."
            class="search-box"
            @input="filterItems"
        />
      </header>

      <!-- 資料表 -->
      <div v-if="loading" class="loading">載入中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <table v-else-if="filteredItems.length > 0" class="data-table">
        <thead>
        <tr>
          <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in filteredItems" :key="item.ID">
          <td v-for="(value, key) in item" :key="key">{{ value }}</td>
          <td>
            <button class="btn btn-secondary" @click="openModal('edit', item)">編輯</button>
            <button class="btn btn-danger" @click="deleteItem(item.ID)">刪除</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else class="no-data">目前無商品。</div>
    </main>

    <!-- 編輯商品彈窗 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>編輯商品</h3>
        <form @submit.prevent="saveItem">
          <div v-for="(value, key) in formData" :key="key">
            <label :for="key">{{ key }}</label>
            <input
                v-model="formData[key]"
                :id="key"
                :disabled="key === 'ID'"
                class="input-field"
            />
          </div>
          <div class="modal-actions">
            <button type="submit" class="btn btn-primary">儲存</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

// 定義商品類型
interface Item {
  ID: number; // 商品 ID
  Title: string; // 商品名稱
  Price: number; // 商品價格
  Quantity: number; // 商品數量
  Description: string; // 商品描述
}

const items = ref<Item[]>([]); // 商品數據
const tableHeaders = ref<string[]>([]); // 資料表欄位名稱
const searchQuery = ref(""); // 搜尋框內容
const filteredItems = ref<Item[]>([]); // 篩選後的商品數據
const showModal = ref(false); // 是否顯示彈窗
const formData = ref<Partial<Item>>({}); // 彈窗表單數據
const loading = ref(false); // 資料加載狀態
const error = ref<string | null>(null); // 錯誤訊息

// 加載商品資料
const fetchItems = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.post('/api/get/MyItems', { tableName: 'items' });
    items.value = response.data as Item[]; // 明確轉換數據類型
    tableHeaders.value = Object.keys(items.value[0] || {}); // 設置表頭
    filterItems();
  } catch (err) {
    console.error("無法加載商品資料：", err);
    error.value = "資料加載失敗，請稍後再試。";
  } finally {
    loading.value = false;
  }
};

// 搜尋與篩選商品
const filterItems = () => {
  filteredItems.value = items.value.filter((item) =>
      Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.value.toLowerCase())
      )
  );
};

// 打開彈窗（僅編輯模式）
const openModal = (type: string, item: Item) => {
  formData.value = { ...item }; // 填充表單數據
  showModal.value = true;
};

// 關閉彈窗
const closeModal = () => {
  showModal.value = false;
};

// 儲存商品（僅編輯）
const saveItem = async () => {
  loading.value = true;
  try {
    await axios.put(`/api/items/${formData.value.ID}`, formData.value);
    await fetchItems(); // 重新加載數據
    closeModal();
  } catch (err) {
    console.error("無法儲存商品：", err);
    alert("儲存失敗，請稍後再試。");
  } finally {
    loading.value = false;
  }
};

// 刪除商品
const deleteItem = async (itemID: number) => {
  if (!confirm("確定要刪除此商品嗎？")) return;
  loading.value = true;
  try {
    await axios.delete(`/api/items/${itemID}`);
    await fetchItems(); // 重新加載數據
  } catch (err) {
    console.error("無法刪除商品：", err);
    alert("刪除失敗，請稍後再試。");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchItems(); // 初始化加載商品資料
});
</script>

<style scoped>
/* 保持原風格一致 */
.admin-panel {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #2a475e;
  color: #c7d5e0;
  height: 100vh;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  padding: 8px;
  border: 1px solid #1b2838;
  border-radius: 5px;
  background-color: #1b2838;
  color: #c7d5e0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid #1b2838;
  text-align: center;
}

.data-table th {
  background-color: #2a475e;
}

.data-table td {
  background-color: #1b2838;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary {
  background-color: #66c0f4;
  color: #1b2838;
}

.btn-secondary {
  background-color: #2a475e;
  color: #c7d5e0;
}

.btn-danger {
  background-color: #d9534f;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
}
</style>
