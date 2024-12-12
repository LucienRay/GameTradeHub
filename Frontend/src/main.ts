import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import ToolBar from "./components/ToolBar.vue";
import SearchBar from './components/SearchBar.vue';
import ChatWidget from './components/ChatWidget.vue';
axios.defaults.withCredentials = true;

const app = createApp(App)

app.component("ToolBar", ToolBar);
app.component("SearchBar", SearchBar)
app.component("ChatWidget", ChatWidget)
app.use(router)

app.mount('#app')
