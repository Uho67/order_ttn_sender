<template>
  <div id="app">
    <h1>Admin Panel</h1>
    <div class="tabs">
      <button @click="activeTab = 'orders'">Orders</button>
      <button @click="activeTab = 'packages'">Packages</button>
      <button @click="activeTab = 'telegramConnection'">Telegram Connection</button>
      <button @click="activeTab = 'novaPostConnection'">Nova Post Connection</button>
    </div>

    <div v-if="activeTab === 'orders'">
      <h2>Orders</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Telegram Chat ID</th>
            <th>Telegram Message ID</th>
            <th>Customer Phone</th>
            <th>Nova Post TTN</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ order.telegram_chat_id }}</td>
            <td>{{ order.telegram_message_id }}</td>
            <td>{{ order.customer_phone }}</td>
            <td>{{ order.nova_post_ttn }}</td>
            <td>{{ order.createdAt }}</td>
            <td>{{ order.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'packages'">
      <h2>Packages</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>TTN</th>
            <th>Sent to Chat</th>
            <th>Created At</th>
            <th>Order ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="packageItem in packages" :key="packageItem.id">
            <td>{{ packageItem.id }}</td>
            <td>{{ packageItem.ttn }}</td>
            <td>{{ packageItem.isSentToChat }}</td>
            <td>{{ packageItem.createdAt }}</td>
            <td>{{ packageItem.orderId }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="activeTab === 'telegramConnection'">
      <h2>Telegram Connection</h2>
      <form @submit.prevent="connectTelegram">
        <label>
          API Name:
          <input v-model="telegramConnection.apiName" required />
        </label>
        <label>
          API Secret:
          <input v-model="telegramConnection.apiSecret" required />
        </label>
        <button type="submit">Connect</button>
      </form>
    </div>

    <div v-if="activeTab === 'novaPostConnection'">
      <h2>Nova Post Connection</h2>
      <form @submit.prevent="connectNovaPost">
        <label>
          Token Nova Posta:
          <input v-model="novaPostToken" required />
        </label>
        <button type="submit">Connect</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'orders',
      orders: [],
      packages: [],
      telegramConnection: {
        apiName: '',
        apiSecret: ''
      },
      novaPostToken: ''
    };
  },
  methods: {
    async fetchOrders() {
      const response = await fetch('http://localhost:3000/api/orders');
      this.orders = await response.json();
    },
    async fetchPackages() {
      const response = await fetch('http://localhost:3000/api/packages');
      this.packages = await response.json();
    },
    async connectTelegram() {
      await fetch('http://localhost:3000/api/telegram_connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.telegramConnection)
      });
      alert('Telegram connection configured successfully!');
    },
    async connectNovaPost() {
      await fetch('http://localhost:3000/api/new_post_connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.novaPostToken })
      });
      alert('Nova Post connection configured successfully!');
    }
  },
  mounted() {
    this.fetchOrders();
    this.fetchPackages();
  }
};
</script>

<style>
.tabs button {
  margin-right: 10px;
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