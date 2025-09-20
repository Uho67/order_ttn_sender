const cron = require('node-cron');
const CleanupService = require('../services/cleanup.service');

const cleanupService = new CleanupService();

// Запускаем очистку каждый день в 9:00 утра
const startCleanupCron = () => {
	cron.schedule('0 9 * * *', async () => {
		console.log('Running daily cleanup...');
		try {
			await cleanupService.cleanupOldOrders();
		} catch (error) {
			console.error('Cleanup cron job failed:', error.message);
		}
	}, {
		scheduled: true,
		timezone: 'Europe/Kiev' // Adjust to your timezone
	});
	console.log('Cleanup cron job scheduled for daily at 9:00 AM');
};

// Запускаем все cron jobs
const startAllCrons = () => {
	startCleanupCron();
};

module.exports = {
	startAllCrons,
	cleanupService,
	// Экспортируем отдельные функции
	startCleanupCron
};
