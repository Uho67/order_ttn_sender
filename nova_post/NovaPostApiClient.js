const axios = require('axios');

class NovaPostApiClient {

    
    /**
     * Fetch the document list from Nova Poshta.
     * @param {string} dateTimeFrom - The start date for the document list (format: DD.MM.YYYY).
     * @param {string} dateTimeTo - The end date for the document list (format: DD.MM.YYYY).
     * @returns {Object} - The response data from Nova Poshta.
     */
    async getDocumentList(dateTimeFrom, dateTimeTo) {
        try {
            const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                apiKey: process.env.NOVA_POSTA_API_KEY,
                modelName: 'InternetDocumentGeneral',
                calledMethod: 'getDocumentList',
                methodProperties: {
                    DateTimeFrom: dateTimeFrom,
                    DateTimeTo: dateTimeTo,
                    GetFullList: 1,
                },
            });
            if (response.data && response.data.data) {
                return response.data.data.map((shipment) => ({
                    nova_post_ttn: shipment.IntDocNumber,
                    customer_phone: shipment.RecipientsPhone.replace(/^38/, ''),
                }));
            } else {
                console.error('Invalid response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching document list:', error.response?.data || error.message);
            throw new Error('Failed to fetch document list from Nova Poshta');
        }
    }
}

module.exports = NovaPostApiClient;