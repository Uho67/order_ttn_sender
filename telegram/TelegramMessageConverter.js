class TelegramMessageConverter {
    constructor() {
      // Define the regex for extracting Ukrainian phone numbers
      this.phoneRegex = /(?:\+?38)?(?:0(66|73|93|97|98|99)\d{7})/;
    }
  
    /**
     * Converts a Telegram message object into an order object.
     * @param {Object} message - The Telegram message object.
     * @returns {Object} - The converted order object.
     */
    convert(message) {
      const phoneMatch = message.text.match(this.phoneRegex);
  
      const customerPhone = phoneMatch ? phoneMatch[0].replace(/^\+?38/, '') : null; // Remove +38 or 38 prefix if present
  
      return {
        telegram_chat_id: message.chat.id.toString(),
        telegram_message_id: message.message_id.toString(),
        customer_phone: customerPhone,
        nova_post_ttn: null, // Default value, can be updated later
      };
    }
  }
  
  module.exports = TelegramMessageConverter;