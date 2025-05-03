const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ConnectionRepository {
    /**
     * Add a new Nova Post connection.
     * @param {string} name - The name of the connection.
     * @param {string} apiKey - The API key for the connection.
     * @returns {Promise<Object>} - The created connection.
     */
    async addConnection(name, token) {
        try {
            const connection = await prisma.novaPostConnection.create({
                data: {
                    name: name,
                    token: token,
                },
            });
            console.log('New Nova Post connection added:', connection);
            return connection;
        } catch (error) {
            console.error('Error adding Nova Post connection:', error.message);
            throw error;
        }
    }

    /**
     * Fetch all Nova Post connections.
     * @returns {Promise<Array>} - A list of all connections.
     */
    async fetchAllConnections() {
        try {
            const connections = await prisma.novaPostConnection.findMany();
            console.log('Fetched all Nova Post connections:', connections);
            return connections;
        } catch (error) {
            console.error('Error fetching Nova Post connections:', error.message);
            throw error;
        }
    }

    /**
     * Delete a Nova Post connection by ID.
     * @param {number} id - The ID of the connection to delete.
     * @returns {Promise<Object>} - The deleted connection.
     */
    async deleteConnectionById(id) {
        try {
            const deletedConnection = await prisma.novaPostConnection.delete({
                where: {
                    id: id,
                },
            });
            console.log(`Nova Post connection with ID ${id} deleted:`, deletedConnection);
            return deletedConnection;
        } catch (error) {
            console.error(`Error deleting Nova Post connection with ID ${id}:`, error.message);
            throw error;
        }
    }
}

module.exports = new ConnectionRepository();