const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
  // 1. Save order
  async saveOrder(order) {
    if (!order.customer_phone) {
        console.error('check fields please');
       return {};
    }

    return await prisma.order.create({
      data: order,
    });
  }

  // 2. Find order by telegram_chat_id
  async findOrderByTelegramChatId(telegramChatId) {
    return await prisma.order.findFirst({
      where: { telegram_chat_id: telegramChatId },
    });
  }

  // 3. Find order by telegram_message_id
  async findOrderByTelegramMessageId(telegramMessageId) {
    return await prisma.order.findFirst({
      where: { telegram_message_id: telegramMessageId },
    });
  }

  // 4. Change order's nova_post_ttn
  async changeOrderNovaPostTtnByCustomerPhone(customerPhone, novaPostTtn) {
    return await prisma.order.updateMany({
      where: { customer_phone: customerPhone },
      data: { nova_post_ttn: novaPostTtn },
    });
  }

  // Update multiple orders with customer_phone and nova_post_ttn pairs
  async setTtnForMultipleOrders(orders) {
    const updatePromises = orders.map(order =>
      prisma.order.updateMany({
        where: { customer_phone: order.customer_phone },
        data: { nova_post_ttn: order.ttn },
      })
    );
  
    return await Promise.all(updatePromises);
  }

  // Change order's customer_phone by telegram_message_id
  async changeOrderCustomerPhoneByTelegramMessageId(telegramMessageId, newCustomerPhone) {
    return await prisma.order.updateMany({
      where: { telegram_message_id: telegramMessageId },
      data: { customer_phone: newCustomerPhone },
    });
  }
}

module.exports = OrderRepository;