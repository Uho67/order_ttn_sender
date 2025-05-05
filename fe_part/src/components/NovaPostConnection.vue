<template>
  <div>
    <h2>Nova Post Connections</h2>
    <table>
      <tr v-for="conn in connections" :key="conn.id">
        <td>{{ conn.name }}</td>
        <td>{{ conn.token }}</td>
        <td>
          <button @click="deleteConnection(conn.name)">Delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      connections: []
    }
  },
  methods: {
    async fetchConnections() {
      const res = await fetch('http://localhost:3000/api/novaPostConnections');
      this.connections = await res.json();
    },
    async deleteConnection(name) {
      if (confirm('Are you sure you want to delete this connection?')) {
        await fetch(`http://localhost:3000/api/novaPostConnections/${name}`, {
          method: 'DELETE'
        });
        this.fetchConnections(); // Refresh the list
      }
    }
  },
  mounted() {
    this.fetchConnections();
  }
}
</script>