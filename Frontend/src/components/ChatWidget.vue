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

<script>
import { ref } from 'vue';
// Import Axios
import axios from 'axios';

export default {
  setup() {
    const isChatOpen = ref(false);

    function toggleChat() {
      isChatOpen.value = !isChatOpen.value;
    }

    return {
      isChatOpen,
      toggleChat,
    };
  },
  data() {
    return {
      friends: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ],
      selectedFriend: null,
      chatMessages: {}, // Store messages for each friend
      newMessage: "",
    };
  },
  methods: {
    // Simulate selecting a friend and loading messages
    async selectFriend(friend) {
      this.selectedFriend = friend;
      if (!this.chatMessages[friend.id]) {
        this.chatMessages[friend.id] = await this.fetchChatMessages(friend.id);
      }
    },

    // Simulate fetching chat messages from a backend
    async fetchChatMessages(friendId) {
      // Simulate a delay to mimic an API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Return mock data
      return [
        { id: 1, sender: "Alice", content: "Hey, how are you?", timestamp: "2024-11-25T10:30:00Z" },
        { id: 2, sender: "You", content: "I'm good, thanks!", timestamp: "2024-11-25T10:32:00Z" },
      ];

      // Uncomment and use the following code to fetch real data from the backend
      /*
      try {
        const response = await axios.get(`/api/chat/${friendId}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching chat messages:', error);
        return [];
      }
      */
    },

    // Send a message (in a real app, send this to the server)
    sendMessage() {
      if (this.newMessage.trim() && this.selectedFriend) {
        const friendId = this.selectedFriend.id;
        if (!this.chatMessages[friendId]) {
          this.chatMessages[friendId] = [];
        }
        this.chatMessages[friendId].push({
          id: this.chatMessages[friendId].length + 1,
          sender: "You",
          content: this.newMessage,
          timestamp: new Date().toISOString(),
        });
        this.newMessage = "";
        this.scrollToBottom();

        // Uncomment and use the following code to send the message to the backend
        /*
        axios.post(`/api/chat/${friendId}`, {
          sender: "You",
          content: this.newMessage,
          timestamp: new Date().toISOString(),
        }).then(response => {
          console.log('Message sent:', response.data);
        }).catch(error => {
          console.error('Error sending message:', error);
        });
        */
      }
    },

    // Scroll chat to the bottom when a new message is sent
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) container.scrollTop = container.scrollHeight;
    },

    // Format message timestamp
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleTimeString();
    },

    // Determine the CSS class for a message (sent or received)
    messageClass(message) {
      return message.sender === "You" ? "sent" : "received";
    },
  },
  computed: {
    currentChatMessages() {
      return this.selectedFriend ? this.chatMessages[this.selectedFriend.id] || [] : [];
    }
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
  max-height: calc(70vh - 100px);
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

.messages {
  scroll-behavior: smooth;
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