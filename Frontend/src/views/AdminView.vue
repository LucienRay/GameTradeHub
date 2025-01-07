<template>
  <div class="admin-panel">
    <!-- 資料表選擇 -->
    <aside class="sidebar">
      <h3>資料表選擇</h3>
      <ul>
        <li
            v-for="table in tables"
            :key="table"
            :class="{ active: table === selectedTable }"
            @click="selectTable(table)"
        >
          {{ table }}
        </li>
      </ul>
    </aside>

    <!-- 資料展示 -->
    <main class="content">
      <header class="content-header">
        <h2>{{ selectedTable ? `${selectedTable} 資料管理` : "請選擇資料表" }}</h2>
        <div v-if="selectedTable" class="actions">
          <button class="btn btn-primary" @click="openModal('add')">新增資料</button>
          <input
              type="text"
              v-model="searchQuery"
              placeholder="搜尋資料..."
              class="search-box"
              @input="filterData"
          />
        </div>
      </header>

      <!-- 資料表 -->
      <div v-if="loading" class="loading">載入中...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <table v-else-if="filteredData.length > 0" class="data-table">
        <thead>
        <tr>
          <th v-for="(header, index) in tableHeaders" :key="index">{{ header }}</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in filteredData" :key="row.ID">
          <td v-for="(value, key) in row" :key="key">{{ value }}</td>
          <td>
            <button class="btn btn-secondary" @click="openModal('edit', row)">編輯</button>
            <button class="btn btn-danger" @click="deleteData(row.ID)">刪除</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else class="no-data">目前無資料。</div>
    </main>

    <!-- 編輯彈窗 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalType === 'edit' ? '編輯資料' : '新增資料' }}</h3>
        <form @submit.prevent="saveData">
          <div v-for="(value, key) in formData" :key="key">
            <label :for="key">{{ key }}</label>
            <input
                v-model="formData[key]"
                :id="key"
                :disabled="key === 'ID' && modalType === 'edit'"
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

<script lang="ts">
import axios from "axios";

export default {
  data() {
    return {
      tables: ["coupons", "games", "images", "items", "messages", "orders", "users", "wish"],
      selectedTable: null as string | null,
      tableData: [] as Record<string, any>[],
      tableHeaders: [] as string[],
      searchQuery: '',
      filteredData: [] as Record<string, any>[],
      showModal: false,
      modalType: '', // 'edit' or 'add'
      formData: {} as Record<string, any>,
      loading: false, // 資料加載狀態
      error: null as string | null, // 錯誤訊息
    };
  },
  methods: {
    async selectTable(table: string) {
      this.selectedTable = table;
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post('/api/get/tableData', { tableName: table });
        this.tableData = response.data;
        this.tableHeaders = Object.keys(this.tableData[0] || {});
        this.filterData();
      } catch (err) {
        console.error("資料加載失敗：", err);
        this.error = "資料加載失敗，請稍後重試。";
      } finally {
        this.loading = false;
      }
    },
    filterData() {
      this.filteredData = this.tableData.filter((item) =>
          Object.values(item).some((value) =>
              value?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
          )
      );
    },
    openModal(type: string, row: Record<string, any> | null = null) {
      this.modalType = type; // 設置模式
      if (type === 'edit' && row) {
        this.formData = { ...row }; // 填充表單數據，包括 ID
      } else {
        this.formData = this.tableHeaders.reduce((acc, header) => {
          acc[header] = '';
          return acc;
        }, {} as Record<string, any>);
      }
      this.showModal = true; // 打開彈窗
    },
    closeModal() {
      this.showModal = false; // 關閉彈窗
    },
    async saveData() {
      console.log('FormData Before Save:', this.formData); // 調試輸出
      if (!this.formData.ID) {
        alert('無法提交：缺少主鍵 ID');
        return;
      }

      this.loading = true;
      try {
        if (this.modalType === 'edit') {
          await axios.put(`/api/${this.selectedTable}/${this.formData.ID}`, this.formData);
        } else {
          await axios.post(`/api/${this.selectedTable}`, this.formData);
        }

        this.selectTable(this.selectedTable!); // 重新加載數據
        this.closeModal();
      } catch (err) {
        console.error('資料保存失敗：', err);
        alert('資料保存失敗，請稍後再試。');
      } finally {
        this.loading = false;
      }
    },
    async deleteData(ID: string | number) {
      if (!confirm("確定要刪除此項目嗎？")) return;

      this.loading = true;
      try {
        await axios.delete(`/api/${this.selectedTable}/${ID}`);
        this.selectTable(this.selectedTable!);
      } catch (err) {
        console.error('資料刪除失敗：', err);
        alert('資料刪除失敗，請稍後再試。');
      } finally {
        this.loading = false;
      }
    },
  },
  async mounted() {
    this.selectTable(this.tables[0]); // 預設選中第一個資料表
  },
};
</script>

<style scoped>
/* Steam 黑色風格 */
:root {
  --primary-color: #1b2838;
  --secondary-color: #2a475e;
  --accent-color: #66c0f4;
  --danger-color: #d9534f;
  --text-color: #c7d5e0;
  --background-color: #171a21;
}

/* 全域設置 */
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
}

.admin-panel {
  display: flex;
  height: 100vh;
}

/* 側邊欄 */
.sidebar {
  width: 200px;
  background-color: var(--secondary-color);
  padding: 20px;
}

.sidebar h3 {
  color: var(--accent-color);
  font-size: 18px;
  margin-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar ul li {
  padding: 10px;
  cursor: pointer;
  color: var(--text-color);
  background-color: var(--secondary-color);
  border-radius: 5px;
  margin-bottom: 5px;
  transition: background-color 0.2s, color 0.2s, transform 0.2s;
}

.sidebar ul li:hover {
  background-color: var(--primary-color);
  transform: scale(1.05);
}

.sidebar ul li.active {
  background-color: var(--accent-color);
  color: var(--primary-color);
  font-weight: bold;
  transform: scale(1.1);
}

/* 主內容區 */
.content {
  flex: 1;
  padding: 20px;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-box {
  padding: 8px;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.data-table th,
.data-table td {
  padding: 10px;
  border: 1px solid var(--primary-color);
  text-align: center;
}

.data-table th {
  background-color: var(--secondary-color);
}

.data-table td {
  background-color: var(--primary-color);
}

/* 按鈕樣式 */
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: var(--accent-color);
  color: var(--primary-color);
}

.btn-primary:hover {
  background-color: #4fa3dd;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: var(--text-color);
}

.btn-secondary:hover {
  background-color: var(--primary-color);
}

.btn-danger {
  background-color: var(--danger-color);
  color: white;
}

.btn-danger:hover {
  background-color: #c9302c;
}

/* 彈窗 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8); /* 背景覆蓋層 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 保持彈窗在其他內容上層 */
}

/* 彈窗內容 */
.modal-content {
  background-color: #ffffff; /* 修改彈窗背景為白色 */
  border: 2px solid #66c0f4; /* 添加藍色邊框 */
  border-radius: 15px; /* 圓角邊框 */
  padding: 30px; /* 內邊距 */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* 添加柔和的陰影 */
  max-width: 600px; /* 限制彈窗寬度 */
  width: 90%; /* 自適應寬度 */
  color: #333333; /* 修改文字顏色 */
  font-family: 'Arial', sans-serif; /* 修改字體 */
  text-align: center; /* 文字置中 */
}

/* 彈窗內按鈕容器 */
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 輸入框 */
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #66c0f4; /* 外框為藍色 */
  border-radius: 10px; /* 圓角效果 */
  background-color: var(--primary-color); /* 背景顏色 */
  color: var(--text-color); /* 文字顏色 */
  font-size: 14px; /* 字體大小 */
  transition: border-color 0.3s, box-shadow 0.3s; /* 增加過渡效果 */
}

/* 聚焦效果 */
.input-field:focus {
  border-color: #4fa3dd; /* 聚焦時的邊框顏色 */
  box-shadow: 0 0 5px rgba(79, 163, 221, 0.8); /* 添加陰影 */
  outline: none; /* 移除默認的外框 */
}
</style>
