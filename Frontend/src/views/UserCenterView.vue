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
        <h1><strong>Welcome, {{ userINFO.Nickname }}</strong></h1>
        <div class="profile-card">
          <h2>Profile Information</h2>
          <p><strong>ID:</strong> {{ userINFO.ID }}</p>
          <p><strong>Nickname:</strong> {{ userINFO.Nickname }}</p>
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

    const switchTab = (tab: string) => {
      activeTab.value = tab;
    };

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
.member-center {
  display: flex;
  height: 100vh;
  background-color: #1b2838; /* Steam-like dark background */
  color: #c7d5e0;
  font-family: Arial, sans-serif;
}

/* Left Sidebar */
.sidebar {
  width: 220px;
  background-color: #101822;
  color: #c7d5e0;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  font-size: 18px;
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
  transition: background-color 0.3s;
  border-left: 4px solid transparent;
}

.sidebar li.active,
.sidebar li:hover {
  background-color: #2a475e;
  color: #fff;
  border-left: 4px solid #66c0f4;
}

/* Main Content */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.tab-content {
  max-width: 600px;
  margin: 0 auto;
  background-color: #2a475e; /* Matching Steam accent */
  padding: 20px;
  border-radius: 5px;
}

.tab-content h1 {
  margin-bottom: 15px;
  border-bottom: 1px solid #66c0f4;
  padding-bottom: 10px;
}

/* Profile card & Settings card */
.profile-card,
.settings-card {
  background-color: #1b2838;
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  color: #c7d5e0;
  border: 1px solid #66c0f4;
}

.profile-card h2,
.settings-card h2 {
  margin-bottom: 10px;
  font-size: 36px;
}

.profile-card p strong,
.settings-card p strong {
  color: #66c0f4;
  font-size: 36px;
}

.profile-card p ,
.settings-card p  {
  font-size: 36px;
}


.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #66c0f4;
  border-radius: 3px;
  background-color: #0f151a;
  color: #c7d5e0;
  font-size: 36px;
}

/* Button */
.btn {
  background-color: #2593d2;
  color: #fff;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.3s;
  font-size: 36px;
}

.btn:hover {
  background-color: #417aab;
}

/* Loading Style */
.loading {
  text-align: center;
  font-size: 20px;
  color: #c7d5e0;
}
</style>