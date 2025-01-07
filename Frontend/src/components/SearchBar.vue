<template>
    
    <div class="search-bar-container">
      <button class="search-bar-button" @click="goToHome">首頁</button>
      
      <button class="search-bar-button">我的訂單</button>
      <button class="search-bar-button">訂單管理</button>
      <button class="search-bar-button">個人資料</button>
        <input
        type="text"
        v-model="searchQuery"
        placeholder="搜尋"
        @input="onSearch"
        @focus="showSuggestions = true"
        @blur="hideSuggestions"
        class="search-input"
        />
    </div>
    <div class="search-suggestions" v-if="suggestions.length && showSuggestions">
        <ul>
            <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @click="selectSuggestion(suggestion)">
            {{ suggestion }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

function goToHome() {
  // Navigate to HomeView (make sure your router is configured correctly)
  router.push("/home");
}

const searchQuery = ref("");
const suggestions = ref<string[]>([
  "Cyberpunk 2077",
  "Elden Ring",
  "Counter-Strike 2",
  "Dota 2",
  "Baldur's Gate 3",
  "The Witcher 3",
  "Stardew Valley",
]);
const showSuggestions = ref(false);

const filteredSuggestions = computed(() =>
  suggestions.value.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const onSearch = () => {
  console.log(`Searching for: ${searchQuery.value}`);
};

const selectSuggestion = (suggestion: string) => {
  searchQuery.value = suggestion;
  showSuggestions.value = false;
  console.log(`Selected: ${suggestion}`);
};

const hideSuggestions = () => {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};
</script>

<style scoped>
.search-bar-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin-left: 15%; 
  margin-top: 15px;
  background: linear-gradient(90deg, rgba(62, 103, 150, 0.919) 11.38%, rgba(58, 120, 177, 0.8) 25.23%, rgb(15, 33, 110) 100%);
  height: 35px;
  width: 70%;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.search-input {
  margin-left: auto;
  margin-right: 3%;
  width: 20%; 
  height: 30px;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #1b2838;
  color: white;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #66c0f4;
}

.search-suggestions {
  width: 20%;
  background-color: #1b2838;
  border: 1px solid #444;
  border-radius: 4px;
  margin-top: 4px;
  margin-left: auto;
  margin-right: 15%;
  max-height: 200px;
  overflow-y: auto;
}

.search-suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.search-suggestions li {
  padding: 10px;
  cursor: pointer;
  color: white;
}

.search-suggestions li:hover {
  background-color: #66c0f4;
}

.search-bar-button {
  margin: 5px;
  background: none;
  border: none;
  padding: 10px 10px;
  font-size: 16px;
  font-weight: bold;
  color: #efefef;
  transition: color 0.3s;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.search-bar-button:hover {
  color: #007bff; 
}
</style>
