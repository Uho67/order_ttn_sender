<template>
  <div>
    <h2>Nova Post Connections</h2>
    
    <!-- Add New Connection Form -->
    <div class="add-connection-section">
      <h3>Add New Connection</h3>
      <form @submit.prevent="addConnection">
        <div class="form-group">
          <label for="connectionName">Connection Name:</label>
          <input
            type="text"
            id="connectionName"
            v-model="connectionForm.name"
            required
            placeholder="Enter connection name"
          />
        </div>
        <div class="form-group">
          <label for="connectionToken">API Token:</label>
          <input
            type="text"
            id="connectionToken"
            v-model="connectionForm.token"
            required
            placeholder="Enter Nova Post API token"
          />
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Adding...' : 'Add Connection' }}
        </button>
        <p v-if="responseMessage" :class="responseMessage.includes('successfully') ? 'success' : 'error'">
          {{ responseMessage }}
        </p>
      </form>
    </div>

    <!-- Connections List -->
    <div class="connections-list">
      <h3>Existing Connections</h3>
      <table v-if="connections.length > 0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Token</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="conn in connections" :key="conn.name">
            <td>{{ conn.name }}</td>
            <td>{{ conn.token }}</td>
            <td>
              <button @click="deleteConnection(conn.name)" class="delete-btn">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="no-connections">No connections found.</p>
    </div>
  </div>
</template>

<script>
import apiConfig from '../config/api.js';

export default {
  data() {
    return {
      connections: [],
      connectionForm: {
        name: '',
        token: ''
      },
      isLoading: false,
      responseMessage: ''
    }
  },
  methods: {
    async fetchConnections() {
      try {
        const res = await fetch(`${apiConfig.API_BASE_URL}/api/novaPostConnections`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch connections');
        }
        
        this.connections = await res.json();
      } catch (error) {
        console.error('Error fetching connections:', error);
        this.responseMessage = 'Failed to fetch connections.';
      }
    },
    
    async addConnection() {
      if (!this.connectionForm.name.trim() || !this.connectionForm.token.trim()) {
        this.responseMessage = 'Please fill in all fields.';
        return;
      }

      this.isLoading = true;
      this.responseMessage = '';

      try {
        const res = await fetch(`${apiConfig.API_BASE_URL}/api/novaPostConnections`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.connectionForm.name,
            token: this.connectionForm.token
          })
        });

        if (!res.ok) {
          const errorData = await res.text();
          throw new Error(errorData || 'Failed to add connection');
        }

        await res.json();
        this.responseMessage = 'Connection added successfully!';
        
        // Clear form
        this.connectionForm.name = '';
        this.connectionForm.token = '';
        
        // Refresh the connections list
        this.fetchConnections();
      } catch (error) {
        console.error('Error adding connection:', error);
        this.responseMessage = `Failed to add connection: ${error.message}`;
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteConnection(name) {
      if (confirm('Are you sure you want to delete this connection?')) {
        try {
          const res = await fetch(`${apiConfig.API_BASE_URL}/api/novaPostConnections/${name}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!res.ok) {
            throw new Error('Failed to delete connection');
          }

          // Refresh the connections list
          this.fetchConnections();
          this.responseMessage = 'Connection deleted successfully!';
        } catch (error) {
          console.error('Error deleting connection:', error);
          this.responseMessage = 'Failed to delete connection.';
        }
      }
    }
  },
  mounted() {
    this.fetchConnections();
  }
}
</script>

<style scoped>
.add-connection-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.delete-btn {
  background-color: #dc3545;
  padding: 5px 10px;
  font-size: 12px;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.connections-list {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.success {
  color: #28a745;
  margin-top: 10px;
}

.error {
  color: #dc3545;
  margin-top: 10px;
}

.no-connections {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 20px;
}
</style>