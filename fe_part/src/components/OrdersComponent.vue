<template>
  <div>
    <h2>Orders</h2>
    
    <!-- Mass Actions -->
    <div v-if="orders.length > 0" class="mass-actions">
      <div class="selection-info">
        <label>
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
          Select All ({{ selectedOrders.length }} selected)
        </label>
        <button 
          v-if="selectedOrders.length > 0" 
          @click="deleteSelectedOrders" 
          class="mass-delete-btn"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Deleting...' : `Delete Selected (${selectedOrders.length})` }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="loading" class="loading">
      Loading orders...
    </div>
    <table v-else-if="orders.length > 0">
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
          </th>
          <th>ID</th>
          <th>Telegram Chat ID</th>
          <th>Telegram Message ID</th>
          <th>Customer Phone</th>
          <th>Nova Post TTN</th>
          <th>Created At</th>
          <th>Updated At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <input 
              type="checkbox" 
              :value="order.id" 
              v-model="selectedOrders"
            >
          </td>
          <td>{{ order.id }}</td>
          <td>{{ order.telegram_chat_id }}</td>
          <td>{{ order.telegram_message_id }}</td>
          <td>{{ order.customer_phone }}</td>
          <td>{{ order.nova_post_ttn }}</td>
          <td>{{ order.createdAt }}</td>
          <td>{{ order.updatedAt }}</td>
          <td>
            <button @click="deleteOrder(order.id)" class="delete-btn">
              Delete
            </button>
          </td>
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
      selectedOrders: [],
      selectAll: false,
      loading: false,
      isDeleting: false,
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
    },
    
    async deleteOrder(orderId) {
      if (!confirm(`Are you sure you want to delete order ${orderId}?`)) {
        return;
      }
      
      try {
        const response = await fetch(`${apiConfig.API_BASE_URL}/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete order: ${response.status}`);
        }
        
        // Remove the order from the local array
        this.orders = this.orders.filter(order => order.id !== orderId);
        
        // Remove from selected orders if it was selected
        this.selectedOrders = this.selectedOrders.filter(id => id !== orderId);
        
        console.log(`Order ${orderId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting order:', error);
        this.error = `Failed to delete order: ${error.message}`;
      }
    },

    async deleteSelectedOrders() {
      if (this.selectedOrders.length === 0) {
        return;
      }

      if (!confirm(`Are you sure you want to delete ${this.selectedOrders.length} orders?`)) {
        return;
      }

      this.isDeleting = true;
      this.error = null;

      try {
        // Delete orders one by one (since we don't have a bulk delete endpoint)
        const deletePromises = this.selectedOrders.map(orderId => 
          fetch(`${apiConfig.API_BASE_URL}/api/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        );

        const responses = await Promise.all(deletePromises);
        
        // Check if all deletions were successful
        const failedDeletions = responses.filter(response => !response.ok);
        
        if (failedDeletions.length > 0) {
          throw new Error(`${failedDeletions.length} out of ${this.selectedOrders.length} orders failed to delete`);
        }

        // Remove deleted orders from local array
        this.orders = this.orders.filter(order => !this.selectedOrders.includes(order.id));
        
        console.log(`${this.selectedOrders.length} orders deleted successfully`);
        
        // Clear selection
        this.selectedOrders = [];
        this.selectAll = false;
        
      } catch (error) {
        console.error('Error deleting selected orders:', error);
        this.error = `Failed to delete orders: ${error.message}`;
      } finally {
        this.isDeleting = false;
      }
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedOrders = this.orders.map(order => order.id);
      } else {
        this.selectedOrders = [];
      }
    }
  },
  watch: {
    selectedOrders: {
      handler(newSelection) {
        // Update selectAll checkbox based on current selection
        this.selectAll = newSelection.length === this.orders.length && this.orders.length > 0;
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

.mass-actions {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.selection-info label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: bold;
  cursor: pointer;
}

.mass-delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.mass-delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.mass-delete-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
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

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.delete-btn:hover {
  background-color: #c82333;
}

input[type="checkbox"] {
  cursor: pointer;
}
</style>