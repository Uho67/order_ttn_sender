#!/usr/bin/env node

require('dotenv').config();
const OrderRepository = require('../order/OrderRepository');

async function cleanupOldOrders() {
    try {
        console.log(`[${new Date().toISOString()}] Starting daily cleanup of old orders...`);
        
        const days = 2; // Delete orders older than 2 days
        const result = await OrderRepository.deleteOldOrders(days);
        
        if (result.count > 0) {
            console.log(`[${new Date().toISOString()}] Cleanup completed: ${result.count} orders deleted`);
        } else {
            console.log(`[${new Date().toISOString()}] Cleanup completed: No orders to delete`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Cleanup failed:`, error.message);
        process.exit(1);
    }
}

// Run the cleanup
cleanupOldOrders();
