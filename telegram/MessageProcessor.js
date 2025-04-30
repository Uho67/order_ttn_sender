class MessageProcessor {
    constructor(bot, orderRepo, newPostApi, orderMessageConverter) {
        this.bot = bot;
        this.orderRepo = orderRepo;
        this.newPostApi = newPostApi;
        this.orderMessageConverter = orderMessageConverter;
    }

    async processMessage(msg) {
        if (msg.text.toLowerCase().startsWith('bot_check_ttns')) {
            await this.handleCheckTtns(msg);
        } else {
            await this.handleSaveOrder(msg);
        }
    }

    async handleCheckTtns(msg) {
        try {
            console.log('Processing TTNs for message:', msg);
            const documentList = await this.newPostApi.getDocumentList('04.04.2025', '05.05.2025');
            for (const shipment of documentList) {
                const order = await this.orderRepo.findOrderByCustomerPhone(shipment.customer_phone);
                if (order) {
                    await this.orderRepo.changeOrderNovaPostTtnByCustomerPhone(order.customer_phone, shipment.nova_post_ttn);
                    this.bot.sendMessage(order.telegram_chat_id, `Here is your TTN: ${shipment.nova_post_ttn}`, {
                        reply_to_message_id: order.telegram_message_id,
                    });

                    // Mark the package as sent to chat
                    await this.packageRepo.setIsSentToChatTrueByOrderId(order.id);
                    console.log(`Package for orderId ${order.id} marked as sent to chat.`);
                }
            }
        } catch (error) {
            console.error('Error processing TTNs:', error.message);
        }
    }

    async handleSaveOrder(msg) {
        const order = this.orderMessageConverter.convert(msg);
        if (!order.customer_phone) {
            return;
        }
        try {
            await this.orderRepo.saveOrder(order);
        } catch (error) {
            console.error('Error saving order:', error.message);
        }
    }
}

module.exports = MessageProcessor;