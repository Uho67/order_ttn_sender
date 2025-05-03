require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ConfigManager = require('../general/ConfigManager');

class TelegramBotService {
    async initializeBot() {
        try {
            // Get the Telegram API token from the configuration
            const token = await ConfigManager.getValueByPath(process.env.TELEGRAM_CONFIG_API_TOKEN_FOR_BOT);
            if (!token) {
                throw new Error('Telegram API token is not configured.');
            }

            // Initialize the bot
            return new TelegramBot(token, { polling: true });

            console.log('Telegram bot initialized successfully.');
        } catch (error) {
            console.error('Error initializing Telegram bot:', error.message);
        }
    }
}

module.exports = new TelegramBotService();