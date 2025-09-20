<template>
  <div>
    <h2>Orders</h2>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="loading" class="loading">
      Loading orders...
    </div>
    <table v-else-if="orders.length > 0">
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
    <div v-else class="no-data">
      No orders found.
    </div>
  </div>
</template>

<script>
import apiConfig from '../config/api.js';

export default {
  data() {
    return {
      orders: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${apiConfig.API_BASE_URL}/api/orders`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        
        this.orders = await response.json();
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchOrders();
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

tr:hover {
  background-color: #f1f1f1;
}

.error-message {
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #6c757d;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #6c757d;
  font-style: italic;
}
</style>