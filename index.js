require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const OrderRepository = require('./order/OrderRepository');
const packageRepo = require('./nova_post/PackageRepository');
const NovaPostApiClient = require('./nova_post/NovaPostApiClient');
const MessageProcessor = require('./telegram/MessageProcessor');
const TelegramBot = require('node-telegram-bot-api');
const TelegramMessageConverter = require('./telegram/TelegramMessageConverter');
const connectionRepo = require('./nova_post/ConnectionRepository');

const newPostApi = new NovaPostApiClient();  // Import the class
const app = express();
const orderRepo = new OrderRepository();
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const axios = require('axios');
const cors = require('cors');
const orderMessageConverter = new TelegramMessageConverter();
const messageProcessor = new MessageProcessor(bot, orderRepo, newPostApi, orderMessageConverter);

app.use(cors());
app.use(bodyParser.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Order TTN Server!');
});

// Add a new Nova Post connection
app.post('/api/novaPostConnections', async (req, res) => {
    try {
        const { name, apiKey } = req.body;

        if (!name || !apiKey) {
            return res.status(400).send('Both "name" and "apiKey" are required.');
        }

        const newConnection = await connectionRepo.addConnection(name, apiKey);
        res.status(201).json(newConnection);
    } catch (error) {
        console.error('Error adding Nova Post connection:', error.message);
        res.status(500).send('An error occurred while adding the Nova Post connection.');
    }
});

// Fetch all Nova Post connections
app.get('/api/novaPostConnections', async (req, res) => {
    try {
        const connections = await connectionRepo.fetchAllConnections();
        res.json(connections);
    } catch (error) {
        console.error('Error fetching Nova Post connections:', error.message);
        res.status(500).send('An error occurred while fetching Nova Post connections.');
    }
});

// Delete a Nova Post connection by ID
app.delete('/api/novaPostConnections/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send('Connection ID is required.');
        }

        const deletedConnection = await connectionRepo.deleteConnectionById(parseInt(id, 10));
        res.json(deletedConnection);
    } catch (error) {
        console.error(`Error deleting Nova Post connection with ID ${req.params.id}:`, error.message);
        res.status(500).send('An error occurred while deleting the Nova Post connection.');
    }
});

// Fetch all orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await orderRepo.getAllOrders(); // Fetch all orders from the database
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).send('An error occurred while fetching orders.');
    }
});

// Fetch all packages
app.get('/api/packages', async (req, res) => {
    try {
        const packages = await packageRepo.getAllPackages(); // Fetch all packages from the database
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error.message);
        res.status(500).send('An error occurred while fetching packages.');
    }
});

// Listen to all text messages
bot.on('message', async (msg) => {
    await messageProcessor.processMessage(msg);
});

bot.on('edited_message', (msg) => {
    const order = orderMessageConverter.convert(msg);
    orderRepo.changeOrderCustomerPhoneByTelegramMessageId(order.telegram_message_id, order.customer_phone);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
