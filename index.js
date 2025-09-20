require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const OrderRepository = require('./order/OrderRepository');
const packageRepo = require('./nova_post/PackageRepository');
const NovaPostApiClient = require('./nova_post/NovaPostApiClient');
const MessageProcessor = require('./telegram/MessageProcessor');
const TelegramBotService = require('./telegram/TelegramBot');
const TelegramMessageConverter = require('./telegram/TelegramMessageConverter');
const connectionRepo = require('./nova_post/ConnectionRepository');
const ConfigManager = require('./general/ConfigManager'); // Import ConfigManager
const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/auth');

// Import cron scheduler
const { startAllCrons } = require('./cron/scheduler');

const newPostApi = new NovaPostApiClient();  // Import the class
const app = express();
const orderRepo = new OrderRepository();
const axios = require('axios');
const cors = require('cors');
const orderMessageConverter = new TelegramMessageConverter();

app.use(cors());
app.use(bodyParser.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Order TTN Server!');
});

// Route to set configuration
app.post('/api/configuration', async (req, res) => {
    try {
        const { config_path, value } = req.body;

        if (!config_path || !value) {
            return res.status(400).send('Both "config_path" and "value" are required.');
        }

        // Use ConfigManager to save the configuration
        await ConfigManager.saveConfig(config_path, value);

        res.status(200).send(`Configuration set: ${config_path} = ${value}`);
    } catch (error) {
        console.error('Error setting configuration:', error.message);
        res.status(500).send('An error occurred while setting the configuration.');
    }
});

// Add a new Nova Post connection
app.post('/api/novaPostConnections', async (req, res) => {
    try {
        const { name, token } = req.body;

        if (!name || !token) {
            return res.status(400).send('Both "name" and "apiKey" are required.');
        }

        const newConnection = await connectionRepo.addConnection(name, token);
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
app.delete('/api/novaPostConnections/:name', async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).send('Connection name is required.');
        }

        const deletedConnection = await connectionRepo.deleteConnectionByName(name);
        res.json(deletedConnection);
    } catch (error) {
        logError('deleteConnectionByName', error);
        throw error;
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

// Delete an order by ID
app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);

        if (!orderId || isNaN(orderId)) {
            return res.status(400).send('Invalid order ID.');
        }

        const deletedOrder = await orderRepo.deleteOrderById(orderId);

        if (deletedOrder) {
            res.json({ message: 'Order deleted successfully', order: deletedOrder });
        } else {
            res.status(404).send('Order not found.');
        }
    } catch (error) {
        console.error('Error deleting order:', error.message);
        res.status(500).send('An error occurred while deleting the order.');
    }
});

// Delete orders by customer phone
app.delete('/api/orders/customer/:phone', async (req, res) => {
    try {
        const customerPhone = req.params.phone;

        if (!customerPhone) {
            return res.status(400).send('Customer phone is required.');
        }

        const result = await orderRepo.deleteOrdersByCustomerPhone(customerPhone);

        if (result.count > 0) {
            res.json({
                message: `Successfully deleted ${result.count} orders for customer ${customerPhone}`,
                deletedCount: result.count
            });
        } else {
            res.status(404).send('No orders found for the specified customer phone.');
        }
    } catch (error) {
        console.error('Error deleting orders by customer phone:', error.message);
        res.status(500).send('An error occurred while deleting orders.');
    }
});

// Delete orders by Telegram chat ID
app.delete('/api/orders/telegram/:chatId', async (req, res) => {
    try {
        const telegramChatId = req.params.chatId;

        if (!telegramChatId) {
            return res.status(400).send('Telegram chat ID is required.');
        }

        const result = await orderRepo.deleteOrdersByTelegramChatId(telegramChatId);

        if (result.count > 0) {
            res.json({
                message: `Successfully deleted ${result.count} orders for Telegram chat ${telegramChatId}`,
                deletedCount: result.count
            });
        } else {
            res.status(404).send('No orders found for the specified Telegram chat ID.');
        }
    } catch (error) {
        console.error('Error deleting orders by Telegram chat ID:', error.message);
        res.status(500).send('An error occurred while deleting orders.');
    }
});

// Bulk delete orders by IDs
app.delete('/api/orders/bulk', async (req, res) => {
    try {
        const { orderIds } = req.body;

        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).send('orderIds array is required and must not be empty.');
        }

        // Convert to integers and validate
        const validOrderIds = orderIds.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id));

        if (validOrderIds.length === 0) {
            return res.status(400).send('No valid order IDs provided.');
        }

        const result = await orderRepo.deleteOrdersByIds(validOrderIds);

        res.json({
            message: `Successfully deleted ${result.count} orders`,
            deletedCount: result.count,
            requestedCount: orderIds.length
        });
    } catch (error) {
        console.error('Error bulk deleting orders:', error.message);
        res.status(500).send('An error occurred while bulk deleting orders.');
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

// Delete a package by ID
app.delete('/api/packages/:id', async (req, res) => {
    try {
        const packageId = parseInt(req.params.id);

        if (!packageId || isNaN(packageId)) {
            return res.status(400).send('Invalid package ID.');
        }

        const deletedPackage = await packageRepo.deletePackageById(packageId);

        if (deletedPackage) {
            res.json({ message: 'Package deleted successfully', package: deletedPackage });
        } else {
            res.status(404).send('Package not found.');
        }
    } catch (error) {
        console.error('Error deleting package:', error.message);
        res.status(500).send('An error occurred while deleting the package.');
    }
});

// Delete packages by Order ID
app.delete('/api/packages/order/:orderId', async (req, res) => {
    try {
        const orderId = parseInt(req.params.orderId);

        if (!orderId || isNaN(orderId)) {
            return res.status(400).send('Invalid order ID.');
        }

        const result = await packageRepo.deletePackagesByOrderId(orderId);

        if (result.count > 0) {
            res.json({
                message: `Successfully deleted ${result.count} packages for order ${orderId}`,
                deletedCount: result.count
            });
        } else {
            res.status(404).send('No packages found for the specified order ID.');
        }
    } catch (error) {
        console.error('Error deleting packages by order ID:', error.message);
        res.status(500).send('An error occurred while deleting packages.');
    }
});

TelegramBotService.initializeBot().then((bot) => {
    const messageProcessor = new MessageProcessor(bot, orderRepo, newPostApi, orderMessageConverter, packageRepo);
    bot.on('message', async (msg) => {
        console.log('Received message:', msg);
        await messageProcessor.processMessage(msg);
    });

    bot.on('edited_message', (msg) => {
        const order = orderMessageConverter.convert(msg);
        orderRepo.changeOrderCustomerPhoneByTelegramMessageId(order.telegram_message_id, order.customer_phone);
    });
})

app.use('/api/auth', authRoutes);

// Remove auth middleware from these routes:
// app.use('/api/configuration', authMiddleware);
// app.use('/api/novaPostConnections', authMiddleware);
// app.use('/api/orders', authMiddleware);
// app.use('/api/packages', authMiddleware);

// Start the server
const PORT = process.env.PORT || 3000; // Default to 3000 if PORT not set
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Start cron jobs
console.log('Starting cron jobs...');
startAllCrons();
