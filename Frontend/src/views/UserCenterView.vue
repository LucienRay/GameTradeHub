<template>
  <div class="member-center">
    <!-- 主內容區域 -->
    <main class="content">
      <!-- Profile 區塊 -->
      <h1><strong>Welcome, {{ userINFO.Nickname }}</strong></h1>
      <div class="profile-card">
        <h2>Profile Information</h2>
        <p><strong>ID:</strong> {{ userINFO.ID }}</p>
        <p><strong>Nickname:</strong> {{ userINFO.Nickname }}</p>
        <p><strong>Email:</strong> {{ userINFO.Email }}</p>
        <p><strong>Phone:</strong> {{ userINFO.Phone }}</p>
        <p><strong>SSN:</strong> {{ userINFO.SSN }}</p>
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

    onMounted(() => {
      axios
        .post("/api/get/userINFO")
        .then((response) => {
          userINFO.value = response.data;
        })
        .catch((error) => {
          console.error("Failed to fetch user info:", error);
        })
        ;
    });

    return {
      userINFO,
    };
  },
};
</script>

<style scoped>
.member-center {
  display: flex;
  height: 100vh;
  background-color: #1b2838;
  /* Steam-like dark background */
  color: #c7d5e0;
  font-family: Arial, sans-serif;
}

/* Main Content */
.content {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
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

.profile-card p,
.settings-card p {
  font-size: 36px;
}
</style>