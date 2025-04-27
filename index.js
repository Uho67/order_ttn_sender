require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const OrderRepository = require('./order/OrderRepository');

const app = express();
const orderRepo = new OrderRepository();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const TelegramMessageConverter = require('./telegram/TelegramMessageConverter');
const axios = require('axios');

const messageConverter = new TelegramMessageConverter();

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
    try {
        const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
          apiKey: 'cecf83c0276197d2c6780d2d84af1a1b',
          modelName: 'InternetDocumentGeneral',
          calledMethod: 'getDocumentList',
          methodProperties: {
            "DateTimeFrom": "04.04.2025",
            "DateTimeTo": "05.05.2025",
            "GetFullList": 1
          }
        });

        console.log(response.data);
    
        // const documents = response.data.data;
    
        // console.log('Your shipments:', documents);
    
        // // You can loop through and print TTNs, recipient names, etc.
        // documents.forEach((doc) => {
        //   console.log(`TTN: ${doc.IntDocNumber}, Recipient: ${doc.RecipientFullName}`);
        // });
    
      } catch (error) {
        console.error('Error fetching documents:', error.response?.data || error.message);
      }
    orderRepo.saveOrder(messageConverter.convert(msg));
});

bot.on('edited_message', (msg) => {
    const order = messageConverter.convert(msg);
    console.log(order);
    orderRepo.changeOrderCustomerPhoneByTelegramMessageId(order.telegram_message_id, order.customer_phone);
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
