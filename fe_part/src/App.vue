<template>
  <div id="app">
    <h1>Admin Panel</h1>
    
    <!-- Auth Section -->
    <div v-if="!isAuthenticated" class="auth-section">
      <div class="auth-tabs">
        <button 
          :class="{ active: activeAuthTab === 'login' }" 
          @click="activeAuthTab = 'login'"
        >
          Login
        </button>
        <button 
          :class="{ active: activeAuthTab === 'register' }" 
          @click="activeAuthTab = 'register'"
        >
          Register
        </button>
      </div>
      
      <LoginForm 
        v-if="activeAuthTab === 'login'" 
        @login-success="handleLoginSuccess"
      />
      <RegisterForm 
        v-if="activeAuthTab === 'register'" 
        @register-success="handleRegisterSuccess"
      />
    </div>

    <!-- Main Content (Protected) -->
    <div v-else>
      <div class="user-info">
        Welcome, {{ currentUser.name || currentUser.email }}!
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>

      <div class="tabs">
        <button @click="activeTab = 'orders'">Orders</button>
        <button @click="activeTab = 'packages'">Packages</button>
        <button @click="activeTab = 'telegramConnection'">Telegram Connection</button>
        <button @click="activeTab = 'novaPostConnection'">Nova Post Connection</button>
      </div>

      <OrdersComponent v-if="activeTab === 'orders'" />
      <PackagesComponent v-if="activeTab === 'packages'" />
      <TelegramConnectionComponent v-if="activeTab === 'telegramConnection'" />
      <NovaPostConnectionComponent v-if="activeTab === 'novaPostConnection'" />
    </div>
  </div>
</template>

<script>
import OrdersComponent from './components/OrdersComponent.vue'
import PackagesComponent from './components/PackagesComponent.vue'
import TelegramConnectionComponent from './components/TelegramConnectionComponent.vue'
import NovaPostConnectionComponent from './components/NovaPostConnection.vue'
import LoginForm from './components/LoginForm.vue'
import RegisterForm from './components/RegisterForm.vue'

export default {
  components: {
    OrdersComponent,
    PackagesComponent,
    TelegramConnectionComponent,
    NovaPostConnectionComponent,
    LoginForm,
    RegisterForm
  },
  data() {
    return {
      activeTab: 'orders',
      activeAuthTab: 'login',
      isAuthenticated: false,
      currentUser: null
    }
  },
  created() {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      this.isAuthenticated = true
      this.currentUser = JSON.parse(user)
    }
  },
  methods: {
    handleLoginSuccess(user) {
      this.isAuthenticated = true
      this.currentUser = user
    },
    handleRegisterSuccess(user) {
      this.isAuthenticated = true
      this.currentUser = user
    },
    handleLogout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.isAuthenticated = false
      this.currentUser = null
    }
  }
}
</script>

<style>
.tabs button {
  margin-right: 10px;
}

.auth-section {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.auth-tabs {
  display: flex;
  margin-bottom: 20px;
}

.auth-tabs button {
  flex: 1;
  padding: 10px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
}

.auth-tabs button.active {
  background: #007bff;
  color: white;
}

.user-info {
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logout-btn {
  padding: 5px 10px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f4f4f4;
}
</style>