<template>
  <div>
    <!-- Toggle Button -->
    <button v-if="!isChatOpen" @click="toggleChat" class="chat-toggle-btn">
      {{ isChatOpen ? 'Close Chat' : 'Open Chat' }}
    </button>
    <!-- Chat Widget -->
    <div v-if="isChatOpen" class="chat-container">
      <!-- Close Button -->
      <button @click="toggleChat" class="close-chat-btn">X</button>
      <!-- Friend List (Left) -->
      <div class="friend-list">
        <div v-for="friend in friends" :key="friend.id" class="friend-item"
             :class="{ selected: selectedFriend && selectedFriend.id === friend.id }" @click="selectFriend(friend)">
          <span>{{ friend.name }}</span>
        </div>
      </div>

      <!-- Chat Log (Right) -->
      <div class="chat-log">
        <div v-if="selectedFriend">
          <div class="chat-header">
            <h2>Chat with {{ selectedFriend.name }}</h2>
          </div>

          <div class="messages" ref="messagesContainer">
            <div v-for="message in currentChatMessages" :key="message.id" :class="messageClass(message)">
              <span class="message-content">{{ message.content }}</span>
              <small class="message-time">{{ formatDate(message.timestamp) }}</small>
            </div>
          </div>

          <form @submit.prevent="sendMessage" class="message-form">
            <input v-model="newMessage" placeholder="Type a message..." required class="message-input" />
            <button type="submit" class="send-button">Send</button>
          </form>
        </div>
        <div v-else>
          <p>Select a friend to start chatting</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

interface Friend {
  id: string;
  name: string;
}

const ws = ref<WebSocket | null>(null);
const friends = ref<Friend[]>([]); // 好友列表
const chatMessages = ref<{ [key: string]: any[] }>({}); // 聊天記錄
const selectedFriend = ref<Friend | null>(null); // 選中的好友
const newMessage = ref(''); // 新訊息內容
const isChatOpen = ref(false); // 聊天室開關

// 切換聊天室
const toggleChat = () => {
  isChatOpen.value = !isChatOpen.value;

  if (isChatOpen.value) {
    // 獲取聊天記錄
    axios
        .post('/api/get/Messages')
        .then((response) => {
          const result: { [key: string]: { Time: string; Context: string; mode: boolean }[] } = response.data;

          // 更新好友列表
          friends.value = Object.keys(result).map((user) => ({
            id: user,
            name: user,
          }));

          // 更新聊天記錄
          for (const [user, messages] of Object.entries(result)) {
            chatMessages.value[user] = messages.map((msg, index) => ({
              id: index + 1,
              sender: msg.mode ? 'You' : user,
              content: msg.Context,
              timestamp: msg.Time,
            }));
          }
        })
        .catch((error) => {
          console.error('Error fetching chat history:', error);
        });
  }
};

// 獲取當前選中好友的聊天記錄
const currentChatMessages = computed(() => {
  return selectedFriend.value ? chatMessages.value[selectedFriend.value.id] || [] : [];
});

// 根據消息發送方設定 CSS 類別
const messageClass = (message: any) => {
  return message.sender === 'You' ? 'sent' : 'received';
};

// 格式化日期
const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString();
};

// 初始化 WebSocket 和獲取聊天記錄
onMounted(() => {
  ws.value = new WebSocket('wss://www.xn--rhy.tw/ws/');

  ws.value.onopen = () => {
    console.log('Connected to WebSocket server');
  };

  ws.value.onmessage = (event) => {
    const message = JSON.parse(event.data);
    console.log('Received message:', message);
    if (!chatMessages.value[message.sender]) {

      chatMessages.value[message.sender] = [];
    }
    chatMessages.value[message.sender].push(message);
  };

  ws.value.onclose = () => {
    console.log('Disconnected from WebSocket server');
  };
});

onUnmounted(() => {
  if (ws.value) {
    ws.value.close();
  }
});

// 發送消息
const sendMessage = () => {
  if (newMessage.value.trim() && selectedFriend.value) {
    const message = {
      sender: 'You',
      receiver: selectedFriend.value.id,
      content: newMessage.value,
      timestamp: new Date().toISOString(),
    };

    axios.post('/api/add/messages', message);
    if (!chatMessages.value[selectedFriend.value.id]) {
      chatMessages.value[selectedFriend.value.id] = [];
    }
    chatMessages.value[selectedFriend.value.id].push(message);

    newMessage.value = '';
  }
};

// 選擇好友
const selectFriend = (friend: Friend) => {
  selectedFriend.value = friend;
  if (!chatMessages.value[friend.id]) {
    chatMessages.value[friend.id] = [];
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 70vh;
  width: 400px;
  border: 1px solid #444;
  background-color: #2c2c2c;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  /* Ensure it stays on top of other elements */
}

.close-chat-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
}

.friend-list {
  width: 150px;
  background-color: #3a3a3a;
  padding: 10px;
  border-right: 1px solid #444;
  overflow-y: auto;
}

.friend-item {
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #4a4a4a;
  color: #fff;
  transition: background-color 0.3s;
}

.friend-item:hover {
  background-color: #5a5a5a;
}

.friend-item.selected {
  background-color: #007bff;
  color: white;
}

.chat-log {
  width: 70%;
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: #2c2c2c;
  color: #fff;
}

.chat-header {
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 10px;
  height: 520px;
  scroll-behavior: smooth;
  /* Adjust height to fit within the container */
}

.sent {
  text-align: right;
  background-color: #4a4a4a;
  padding: 8px;
  margin: 5px 0;
  border-radius: 10px;
  align-self: flex-end;
  color: white;
}

.received {
  text-align: left;
  background-color: #5c5b5b;
  padding: 8px;
  margin: 5px 0;
  border-radius: 10px;
  align-self: flex-start;
  color: white;
}

.message-content {
  word-wrap: break-word;
  display: block;
}

.message-time {
  font-size: 0.8em;
  color: #b0b0b0;
  margin-top: 2px;
}

.message-form {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #555;
  border-radius: 5px;
  background-color: #444;
  color: #fff;
}

.send-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #0056b3;
}

.chat-toggle-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1100;
  /* Ensure it stays on top of the chat container */
}

.chat-toggle-btn:hover {
  background-color: #0056b3;
}
</style>
