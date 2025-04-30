<template>
  <div>
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
</template>

<script>
export default {
  data() {
    return {
      orders: [] // Stores the list of orders
    };
  },
  methods: {
    async fetchOrders() {
      const response = await fetch('http://localhost:3000/api/orders');
      this.orders = await response.json();
    }
  },
  mounted() {
    this.fetchOrders(); // Fetch orders when the component is mounted
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
</style>