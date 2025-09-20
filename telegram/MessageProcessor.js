class MessageProcessor {
    constructor(bot, orderRepo, newPostApi, orderMessageConverter, packageRepo) {
        this.bot = bot;
        this.orderRepo = orderRepo;
        this.newPostApi = newPostApi;
        this.orderMessageConverter = orderMessageConverter;
        this.packageRepo = packageRepo;
    }

    async processMessage(msg) {
        console.log('=== NEW MESSAGE ===');
        console.log('Chat ID:', msg.chat.id);
        console.log('Chat Type:', msg.chat.type);
        console.log('Chat Title:', msg.chat.title);
        console.log('From:', msg.from.username || msg.from.first_name);
        console.log('Text:', msg.text);
        console.log('==================');

        // Check if message has text content
        if (!msg.text) {
            console.log('Message has no text content, skipping...');
            return;
        }

        if (msg.text.toLowerCase().startsWith('bot_check_ttns')) {
            await this.handleCheckTtns(msg);
        } else {
            await this.handleSaveOrder(msg);
        }
    }

    async handleCheckTtns(msg) {
        try {
            console.log('Processing TTNs for message:', msg);

            // Генерируем динамические даты: вчера 23:55 до сегодня 23:55
            const { fromDate, toDate } = this.getDateRange();
            console.log(`Checking TTNs from ${fromDate} to ${toDate}`);

            const documentList = await this.newPostApi.getDocumentList(fromDate, toDate);
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

    /**
     * Генерирует диапазон дат: вчера 23:55 до сегодня 23:55
     * @returns {Object} - Объект с fromDate и toDate в формате DD.MM.YYYY
     */
    getDateRange() {
        const now = new Date();
        const today = new Date(now);
        const yesterday = new Date(now);

        // Устанавливаем время 23:55 для обеих дат
        today.setHours(23, 55, 0, 0);
        yesterday.setDate(now.getDate() - 2);
        yesterday.setHours(23, 55, 0, 0);

        // Форматируем даты в формат DD.MM.YYYY
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}.${month}.${year}`;
        };

        return {
            fromDate: formatDate(yesterday),
            toDate: formatDate(today)
        };
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