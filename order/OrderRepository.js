const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class OrderRepository {
    async getAllOrders() {
        try {
            return await prisma.order.findMany(); // Fetch all orders from the database
        } catch (error) {
            console.error('Error fetching all orders:', error);
            throw error;
        }
    }
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

  /**
     * Change the nova_post_ttn for an order by customer phone.
     * If a package exists for the order, update its TTN.
     * If no package exists, create a new package.
     * @param {string} customerPhone - The customer's phone number.
     * @param {string} novaPostTtn - The new Nova Post TTN.
     * @returns {Object} - The updated or newly created package.
     */
  async changeOrderNovaPostTtnByCustomerPhone(customerPhone, novaPostTtn) {
    try {
        // Update the nova_post_ttn for the order
        const updatedOrders = await prisma.order.updateMany({
            where: { customer_phone: customerPhone },
            data: { nova_post_ttn: novaPostTtn },
        });

        // Fetch the updated order to get its ID
        const order = await prisma.order.findFirst({
            where: { customer_phone: customerPhone },
        });

        if (!order) {
            throw new Error(`Order with customer phone ${customerPhone} not found.`);
        }

        // Check if a package exists for the order
        const existingPackage = await prisma.package.findFirst({
            where: { orderId: order.id },
        });

        if (existingPackage) {
            // Update the TTN of the existing package
            const updatedPackage = await prisma.package.update({
                where: { id: existingPackage.id },
                data: { ttn: novaPostTtn },
            });
            console.log('Package updated:', updatedPackage);
            return updatedPackage;
        } else {
            // Create a new package if none exists
            const newPackage = await prisma.package.create({
                data: {
                    ttn: novaPostTtn,
                    isSentToChat: false,
                    orderId: order.id, // Associate the package with the order
                },
            });
            console.log('New package created:', newPackage);
            return newPackage;
        }
    } catch (error) {
        console.error('Error updating nova_post_ttn and handling package:', error);
        throw error;
    }
}

    /**
     * Set isSentToChat to true for a package by orderId.
     * @param {number} orderId - The ID of the order.
     * @returns {Object|null} - The updated package or null if no package is found.
     */
    async setIsSentToChatTrueByOrderId(orderId) {
        try {
            const updatedPackage = await prisma.package.updateMany({
                where: { orderId: orderId },
                data: { isSentToChat: true },
            });

            if (updatedPackage.count > 0) {
                console.log(`isSentToChat set to true for packages with orderId: ${orderId}`);
                return updatedPackage;
            } else {
                console.log(`No packages found for orderId: ${orderId}`);
                return null;
            }
        } catch (error) {
            console.error('Error setting isSentToChat to true:', error);
            throw error;
        }
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

  async findOrderByCustomerPhone(customerPhone) {
    try {
      return await prisma.order.findFirst({
        where: { customer_phone: customerPhone },
      });
    } catch (error) {
      console.error('Error finding order by customer phone:', error);
      return null;
    }
  }
}

module.exports = OrderRepository;