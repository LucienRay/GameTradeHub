<template>
    <div class="toolbar">
      <button
        v-for="tool in tools"
        :key="tool.label"
        :title="tool.tooltip"
        @click="tool.action"
        class="toolbar-button"
      >
        <i :class="tool.icon"></i> {{ tool.label }}
      </button>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// 定義工具按鈕數據
const tools = ref([
{
    label: "登入",
    tooltip: "登入",
    icon: "fa fa-plus",
    action: () => {
        router.push('/login')
    },
},
// {
//   label: "|",
//   tooltip: "保存進度",
//   icon: "fa fa-save",
//   action: () => alert("保存成功"),
// },
// {
//   label: "幫助",
//   tooltip: "查看幫助",
//   icon: "fa fa-question-circle",
//   action: () => alert("這是幫助內容"),
// },
]);
</script>
  
<style scoped>
.toolbar {
  background-color: #171a21;
  display: flex;
  flex-direction: row-reverse;
  gap: 10px; 
  padding: 5px 100px;
}
.toolbar-button {
  background: none;
  border: none;
  padding: 5px 10px;
  font-size: 14px;
  color: #b8b6b4;
  cursor: pointer;
  transition: color 0.3s;
}

.toolbar-button:hover {
  color: #007bff; 
}

.toolbar-button i {
  font-size: 16px;
}
</style>
  