<template>
  <div>
    <h1>Register</h1>
    <label for="username">Username</label><br />
    <input type="text" v-model="username" required /><br />
    <p v-if="errors.username" class="errorHint">Username must contain at least 8 characters at most 20 characters.</p>

    <label for="password">Password</label><br />
    <input type="password" v-model="password" required /><br />
    <p v-if="errors.password" class="errorHint">Password must contain at least 8 characters, including uppercase, lowercase letters, numbers, and special characters.</p>

    <label for="ssn">SSN</label><br />
    <input type="text" v-model="ssn"required /><br />
    <p v-if="errors.ssn" class="errorHint">SSN is not valid.</p>

    <label for="nickname">Nickname</label><br />
    <input type="text" v-model="nickname" required /><br />
    <p v-if="errors.nickname" class="errorHint">Nickname should not be empty.</p>

    <label for="phone">Phone</label><br />
    <input type="text" v-model="phone" required /><br />
    <p v-if="errors.phone" class="errorHint">Phone is not valid.</p>

    <label for="email">Email</label><br />
    <input type="email" v-model="email" required /><br />
    <p v-if="errors.email" class="errorHint">Email is not valid.</p>

    <button @click="register">Register</button>
  </div>
</template>


<script setup lang="ts">
  import axios from "axios";
  import { ref } from "vue";
  import {useRouter} from "vue-router";

  const username = ref('');
  const password = ref('');
  const ssn = ref('');
  const nickname = ref('');
  const phone = ref('');
  const email = ref('');
  const router = useRouter();
  const errors = ref({
    username: false,
    password: false,
    ssn: false,
    nickname: false,
    phone: false,
    email: false,
  });



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
      router.push('/')
    }).catch((error) => {
      const errorResponse = error.response.data.validationResults;
      errors.value.username = !errorResponse.username;
      errors.value.password = !errorResponse.password;
      errors.value.ssn = !errorResponse.ssn;
      errors.value.nickname = !errorResponse.nickname;
      errors.value.phone = !errorResponse.phone;
      errors.value.email = !errorResponse.email;
    });
  }
</script>

<style scoped>
.errorHint {
  color: red;
}
</style>