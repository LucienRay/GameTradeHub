<template>
  <div class="member-center">
    <!-- 左側導航欄 -->
    <aside class="sidebar">
      <ul>
        <li class="menu-item" :class="{ active: activeTab === 'profile' }" @click="switchTab('profile')">
          <i class="icon fas fa-user"></i> Profile
        </li>
        <li class="menu-item" :class="{ active: activeTab === 'orders' }" @click="switchTab('orders')">
          <i class="icon fas fa-shopping-cart"></i> Orders
        </li>
        <li class="menu-item" :class="{ active: activeTab === 'settings' }" @click="switchTab('settings')">
          <i class="icon fas fa-cog"></i> Settings
        </li>
      </ul>
    </aside>

    <!-- 主內容區域 -->
    <main class="content">
      <div v-if="activeTab === 'profile'" class="tab-content">
        <h1>Welcome, {{ user.name }}</h1>
        <div class="profile-card">
          <h2>Profile Information</h2>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Member Since:</strong> {{ user.joinDate }}</p>
          <p><strong>Membership Level:</strong> {{ user.membership }}</p>
        </div>
      </div>

      <div v-if="activeTab === 'orders'" class="tab-content">
        <h1>Your Orders</h1>
        <div v-for="order in orders" :key="order.id" class="order-card">
          <h2>Order #{{ order.id }}</h2>
          <p><strong>Date:</strong> {{ order.date }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
        </div>
      </div>

      <div v-if="activeTab === 'settings'" class="tab-content">
        <h1>Settings</h1>
        <div class="settings-card">
          <h2>Change Password</h2>
          <input type="password" placeholder="New Password" />
          <button class="btn">Update</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'profile', // 默認顯示的標籤
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        joinDate: '2023-01-15',
        membership: 'Premium',
      },
      orders: [
        { id: '1234', date: '2024-01-01', status: 'Completed' },
        { id: '1235', date: '2024-01-10', status: 'Pending' },
      ],
    };
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>

<style scoped>
/* 整體布局 */
.member-center {
  display: flex;
  height: 100vh;
  background-color: #1b2838;
  color: #c7d5e0;
  font-family: Arial, sans-serif;
}

/* 左側邊欄 */
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

.menu-item {
  padding: 15px;
  margin-bottom: 10px;
  color: #c7d5e0;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
}

.menu-item i {
  margin-right: 10px;
}

.menu-item:hover,
.menu-item.active {
  background-color: #1f415e;
  color: #fff;
  border-left: 4px solid #66c0f4;
}

/* 主內容區域 */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
}

.tab-content {
  max-width: 800px;
  margin: 0 auto;
}

.profile-card,
.order-card,
.settings-card {
  background-color: #2a475e;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.profile-card h2,
.order-card h2,
.settings-card h2 {
  margin-bottom: 10px;
}

.btn {
  background-color: #66c0f4;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #417aab;
}
</style>
