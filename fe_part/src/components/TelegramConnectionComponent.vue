<template>
    <div>
      <h2>Telegram Connection</h2>
      <form @submit.prevent="connectTelegram">
        <label>
          API Token:
          <input v-model="apiToken" required />
        </label>
        <button type="submit">Set telegram token</button>
      </form>
      <div v-if="responseMessage">
        <p>{{ responseMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        apiToken: '',
        responseMessage: ''
      };
    },
    methods: {
      async connectTelegram() {
        try {
          const response = await axios.post('http://localhost:3000/api/configuration', {
            config_path: 'TELEGRAM_CONFIG_API_TOKEN_FOR_BOT',
            value: this.apiToken,
          });
          this.responseMessage = 'Telegram API Token configured successfully!';
          console.log(response.data);
        } catch (error) {
          console.error('Error configuring Telegram API Token:', error);
          this.responseMessage = 'Failed to configure Telegram API Token.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  form {
    margin-top: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 10px;
  }
  
  input {
    margin-left: 10px;
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>