<template>
  <div>
    <h1>Register</h1>
      <label for="username">Username</label><br />
      <input type="text" v-model="username" required><br />
      <label for="password">Password</label><br />
      <input type="password" v-model="password" required/><br />
      <label for="ssn">SSN</label><br />
      <input type="text" v-model="ssn" required><br />
      <label for="nickname">Nickname</label><br />
      <input type="text" v-model="nickname" required><br />
      <label for="phone">Phone</label><br />
      <input type="text" v-model="phone" required><br />
      <label for="email">Email</label><br />
      <input type="email" v-model="email" required><br />

      <button @click="register">Register</button>
  </div>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { ref } from "vue";

  const username = ref('');
  const password = ref('');
  const ssn = ref('');
  const nickname = ref('');
  const phone = ref('');
  const email = ref('');

  function register() {
    console.log('Register button clicked')
    if(username.value === '' || password.value === '' || ssn.value === '' || nickname.value === '' || phone.value === '' || email.value === '') {
      alert('Please fill in all fields');
      return;
    }
    axios.post('/api/register', {
      username: username.value,
      password: password.value,
      ssn: ssn.value,
      nickname: nickname.value,
      phone: phone.value,
      email: email.value
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