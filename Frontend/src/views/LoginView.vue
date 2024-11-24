<template>
  <div>
    <h1>Login</h1>
    <p>Account:</p>
    <input type="text" v-model="username" placeholder="Username" />
    <p>Password:</p>
    <input type="password" v-model="password" placeholder="Password" />
    <br />
    <button @click="login">Login</button>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { ref } from "vue";

  const username = ref('');
  const password = ref('');
  function login() {
    console.log('Login button clicked')
    axios.post('/api/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      console.log(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }
</script>

<style scoped>

</style>