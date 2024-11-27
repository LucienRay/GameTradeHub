<template>
  <div>
     <!-- Toggle Button -->
     <button @click="toggleChat" class="chat-toggle-btn">
      {{ isChatOpen ? 'Close Chat' : 'Open Chat' }}
    </button>
        <!-- Chat Widget -->
  <div v-if="isChatOpen" class="chat-container">
    <!-- Friend List (Left) -->
    <div class="friend-list">
      <div
        v-for="friend in friends"
        :key="friend.id"
        class="friend-item"
        :class="{ selected: selectedFriend && selectedFriend.id === friend.id }"
        @click="selectFriend(friend)"
      >
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
          <div v-for="message in chatMessages" :key="message.id" :class="messageClass(message)">
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

<script setup>
import { ref } from 'vue';

const isChatOpen = ref(false); // State to control chat visibility

function toggleChat() {
  isChatOpen.value = !isChatOpen.value;
}
</script>

<script>
export default {

  data() {
    return {
      friends: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
        { id: 3, name: "Charlie" },
      ],
      selectedFriend: null,
      chatMessages: [],
      newMessage: "",
    };
  },
  methods: {
    // Simulate selecting a friend and loading messages
    selectFriend(friend) {
      this.selectedFriend = friend;
      this.chatMessages = [
        { id: 1, sender: "Alice", content: "Hey, how are you?", timestamp: "2024-11-25T10:30:00Z" },
        { id: 2, sender: "You", content: "I'm good, thanks!", timestamp: "2024-11-25T10:32:00Z" },
      ];
    },

    // Send a message (in a real app, send this to the server)
    sendMessage() {
      if (this.newMessage.trim()) {
        this.chatMessages.push({
          id: this.chatMessages.length + 1,
          sender: "You",
          content: this.newMessage,
          timestamp: new Date().toISOString(),
        });
        this.newMessage = "";
        this.scrollToBottom();
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
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  border: 1px solid #444; /* Darker border for contrast */
  background-color: #2c2c2c; /* Dark gray background */
}

.friend-list {
  width: 250px;
  background-color: #3a3a3a; /* Slightly lighter dark gray for friend list */
  padding: 10px;
  border-right: 1px solid #444;
  overflow-y: auto;
}

.friend-item {
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  border-radius: 5px;
  background-color: #4a4a4a; /* Mid-gray for friend items */
  color: #fff; /* White text for visibility */
  transition: background-color 0.3s;
}

.friend-item:hover {
  background-color: #5a5a5a; /* Slightly lighter gray on hover */
}

.friend-item.selected {
  background-color: #007bff; /* Blue for selected friend */
  color: white; /* White text for selected friend */
}

.chat-log {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: #2c2c2c; /* Consistent dark gray background */
  color: #fff; /* White text for chat log */
}

.chat-header {
  margin-bottom: 20px;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff; /* White header text */
}

.messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding-right: 10px;
}

.sent {
  text-align: right;
  background-color: #4a4a4a; /* Green for sent messages */
  padding: 8px;
  margin: 5px 0;
  border-radius: 10px;
  align-self: flex-end;
  color: white; /* White text for contrast */
}

.received {
  text-align: left;
  background-color: #5c5b5b; /* Gray for received messages */
  padding: 8px;
  margin: 5px 0;
  border-radius: 10px;
  align-self: flex-start;
  color: white; /* White text for contrast */
}

.message-content {
  display: block;
}

.message-time {
  font-size: 0.8em;
  color: #b0b0b0; /* Light gray for timestamps */
  margin-top: 2px;
}

.message-form {
  display: flex;
  margin-top: 10px;
  gap: 10px; /* Add spacing between input and button */
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #555; /* Dark gray border */
  border-radius: 5px;
  background-color: #444; /* Darker input background */
  color: #fff; /* White text for input */
}

.send-button {
  padding: 10px 15px;
  background-color: #007bff; /* Blue send button */
  color: #fff; /* White text */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.send-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Smooth scrolling for chat messages */
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
}

.chat-toggle-btn:hover {
  background-color: #0056b3;
}

</style>
