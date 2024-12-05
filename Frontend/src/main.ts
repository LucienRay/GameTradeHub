import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios  from "axios";
import ToolBar from "./components/ToolBar.vue";
axios.defaults.withCredentials = true;

const app = createApp(App)

app.component("ToolBar", ToolBar);
app.use(router)

app.mount('#app')
