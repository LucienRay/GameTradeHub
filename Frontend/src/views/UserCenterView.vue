<template>
  <div class="member-center">
    <!-- 左側導航欄 -->
    <aside class="sidebar">
      <ul>
        <li :class="{ active: activeTab === 'profile' }" @click="switchTab('profile')">
          <i class="fas fa-user"></i> Profile
        </li>
        <li :class="{ active: activeTab === 'settings' }" @click="switchTab('settings')">
          <i class="fas fa-cog"></i> Settings
        </li>
      </ul>
    </aside>

    <!-- 主內容區域 -->
    <main class="content">
      <div v-if="loading" class="loading">Loading...</div>

      <!-- Profile 區塊 -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <h1>Welcome, {{ userINFO.Nickname }}</h1>
        <div class="profile-card">
          <h2>Profile Information</h2>
          <p><strong>ID:</strong> {{ userINFO.ID }}</p>
          <p><strong>Email:</strong> {{ userINFO.Email }}</p>
          <p><strong>Phone:</strong> {{ userINFO.Phone }}</p>
          <p><strong>SSN:</strong> {{ userINFO.SSN }}</p>
        </div>
      </div>

      <!-- Settings 區塊 -->
      <div v-if="activeTab === 'settings'" class="tab-content">
        <h1>Settings</h1>
        <div class="settings-card">
          <h2>Change Password</h2>
          <input type="password" placeholder="New Password" class="input-field" />
          <button class="btn">Update</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

// 定義使用者資訊的資料類型
interface UserINFO {
  ID: number;
  SSN: string;
  Nickname: string;
  Phone: string;
  Email: string;
}

export default {
  setup() {
    const userINFO = ref<UserINFO>({
      ID: 0,
      SSN: "",
      Nickname: "",
      Phone: "",
      Email: "",
    });

    const loading = ref(true);
    const activeTab = ref("profile");

    // 切換選單的方法
    const switchTab = (tab: string) => {
      activeTab.value = tab;
    };

    // 請求使用者資料
    onMounted(() => {
      axios
          .post("/api/get/userINFO")
          .then((response) => {
            userINFO.value = response.data;
          })
          .catch((error) => {
            console.error("Failed to fetch user info:", error);
          })
          .finally(() => {
            loading.value = false;
          });
    });

    return {
      userINFO,
      loading,
      activeTab,
      switchTab,
    };
  },
};
</script>

<style scoped>
/* 整體佈局 */
.member-center {
  display: flex;
  height: 100vh;
  background-color: #1b2838;
  color: #c7d5e0;
  font-family: Arial, sans-serif;
}

/* 左側導航欄 */
.sidebar {
  width: 200px;
  background-color: #101822;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 15px;
  margin-bottom: 10px;
  color: #c7d5e0;
  cursor: pointer;
  transition: all 0.3s;
}

.sidebar li.active,
.sidebar li:hover {
  background-color: #1f415e;
  color: #fff;
  border-left: 4px solid #66c0f4;
}

/* 主內容 */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.tab-content {
  max-width: 600px;
  margin: 0 auto;
}

.profile-card,
.settings-card {
  background-color: #2a475e;
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.profile-card h2,
.settings-card h2 {
  margin-bottom: 10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 3px;
  font-size: 14px;
}

.btn {
  background-color: #66c0f4;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #417aab;
}

/* Loading 樣式 */
.loading {
  text-align: center;
  font-size: 20px;
  color: #c7d5e0;
}
</style>
