<template>
    <div>
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
  </template>
  
  <script>
  export default {
    data() {
      return {
        packages: []
      };
    },
    methods: {
      async fetchPackages() {
        const response = await fetch('http://localhost:3000/api/packages');
        this.packages = await response.json();
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
  </style>