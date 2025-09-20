<template>
  <div>
    <h2>Packages</h2>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="loading" class="loading">
      Loading packages...
    </div>
    <table v-else-if="packages.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>TTN</th>
          <th>Sent to Chat</th>
          <th>Created At</th>
          <th>Order ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="packageItem in packages" :key="packageItem.id">
          <td>{{ packageItem.id }}</td>
          <td>{{ packageItem.ttn }}</td>
          <td>{{ packageItem.isSentToChat }}</td>
          <td>{{ packageItem.createdAt }}</td>
          <td>{{ packageItem.orderId }}</td>
          <td>
            <button @click="deletePackage(packageItem.id)" class="delete-btn">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="no-data">
      No packages found.
    </div>
  </div>
</template>

<script>
import apiConfig from '../config/api.js';

export default {
  data() {
    return {
      packages: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchPackages() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch(`${apiConfig.API_BASE_URL}/api/packages`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch packages: ${response.status}`);
        }
        
        this.packages = await response.json();
      } catch (error) {
        console.error('Error fetching packages:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async deletePackage(packageId) {
      if (!confirm(`Are you sure you want to delete package ${packageId}?`)) {
        return;
      }
      
      try {
        const response = await fetch(`${apiConfig.API_BASE_URL}/api/packages/${packageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete package: ${response.status}`);
        }
        
        // Remove the package from the local array
        this.packages = this.packages.filter(pkg => pkg.id !== packageId);
        
        console.log(`Package ${packageId} deleted successfully`);
      } catch (error) {
        console.error('Error deleting package:', error);
        this.error = `Failed to delete package: ${error.message}`;
      }
    }
  },
  mounted() {
    this.fetchPackages();
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
</style>