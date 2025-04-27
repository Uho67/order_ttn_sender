require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const OrderRepository = require('./order/OrderRepository');
const NovaPostApiClient = require('./nova_post/NovaPostApiClient');
const newPostApi = new NovaPostApiClient();  // Import the class
const app = express();
const orderRepo = new OrderRepository();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const TelegramMessageConverter = require('./telegram/TelegramMessageConverter');
const axios = require('axios');

const orderMessageConverter = new TelegramMessageConverter();

app.use(bodyParser.json());

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the Order TTN Server!');
});

// Create a new order
app.post('/orders', async (req, res) => {
    const { telegram_chat_id, telegram_message_id, customer_phone, nova_post_ttn } = req.body;

    try {
        const newOrder = await orderRepo.saveOrder({
            telegram_chat_id,
            telegram_message_id,
            customer_phone,
            nova_post_ttn,
        });
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('An error occurred');
    }
});

// Fetch all orders
app.get('/orders', async (req, res) => {
    try {
        const orders = await orderRepo.prisma.order.findMany(); // Directly using Prisma for fetching all orders
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('An error occurred');
    }
});

// Update TTN for multiple orders by customer_phone
app.put('/orders/ttn', async (req, res) => {
    const orders = req.body; // Expecting an array of { customer_phone, ttn }

    try {
        const result = await orderRepo.setTtnForMultipleOrders(orders);
        res.json(result);
    } catch (error) {
        console.error('Error updating TTNs:', error);
        res.status(500).send('An error occurred');
    }
});

// Listen to all text messages
bot.on('message', async (msg) => {
    if (msg.text.toLowerCase().startsWith('bot_check_ttns')) {
        try {
            console.log(msg);
            const documentList = await newPostApi.getDocumentList('04.04.2025', '05.05.2025');
            documentList.forEach(async (shipment) => {
                const order = await orderRepo.findOrderByCustomerPhone(shipment.customer_phone);
                if (order) {
                    await orderRepo.changeOrderNovaPostTtnByCustomerPhone(order.customer_phone, shipment.nova_post_ttn);
                    bot.sendMessage(order.telegram_chat_id, 'Here is your TTN ' + shipment.nova_post_ttn, {
                        reply_to_message_id: order.telegram_message_id
                      });
                }
            });
        } catch (error) {
            console.error('Error:', error.message);
        }
      }
      
    const order = orderMessageConverter.convert(msg);
    if (!order.customer_phone) {
        return;
    }
    orderRepo.saveOrder(order);
});

bot.on('edited_message', (msg) => {
    const order = orderMessageConverter.convert(msg);
    orderRepo.changeOrderCustomerPhoneByTelegramMessageId(order.telegram_message_id, order.customer_phone);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
