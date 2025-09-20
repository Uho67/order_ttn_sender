const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CleanupService {
	constructor() {
		this.days = 5; // Delete orders older than 2 days
	}

	/**
	 * Delete orders older than specified days.
	 * @param {number} days - Number of days (default: 2).
	 * @returns {Object} - The result of the delete operation.
	 */
	async deleteOldOrders(days = this.days) {
		try {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - days);

			const result = await prisma.order.deleteMany({
				where: {
					createdAt: {
						lt: cutoffDate
					}
				}
			});

			console.log(`${result.count} orders older than ${days} days deleted.`);
			return result;
		} catch (error) {
			console.error('Error deleting old orders:', error);
			throw error;
		}
	}

	/**
	 * Get count of orders older than specified days.
	 * @param {number} days - Number of days (default: 2).
	 * @returns {number} - Count of old orders.
	 */
	async getOldOrdersCount(days = this.days) {
		try {
			const cutoffDate = new Date();
			cutoffDate.setDate(cutoffDate.getDate() - days);

			const count = await prisma.order.count({
				where: {
					createdAt: {
						lt: cutoffDate
					}
				}
			});

			return count;
		} catch (error) {
			console.error('Error counting old orders:', error);
			throw error;
		}
	}

	/**
	 * Cleanup old orders (main cleanup method)
	 */
	async cleanupOldOrders() {
		try {
			console.log('Starting daily cleanup of old orders...');

			const count = await this.getOldOrdersCount();
			if (count === 0) {
				console.log('No orders to clean up.');
				return;
			}

			const result = await this.deleteOldOrders();
			console.log(`Cleanup completed: ${result.count} orders deleted`);

			return result;
		} catch (error) {
			console.error('Cleanup failed:', error.message);
			throw error;
		}
	}
}

module.exports = CleanupService;
