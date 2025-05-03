const axios = require('axios');
const connectionRepository = require('./ConnectionRepository');

class NovaPostApiClient {

        /**
     * TOdo Create a new TTN (Transport Waybill)
     * @param {Object} ttnData - The data required to create a TTN.
     * @returns {Promise<Object>} - The response from Nova Poshta API.
     */
        async createTTN(ttnData) {
            try {
                const response = await axios.post(this.apiUrl, {
                    apiKey: this.apiKey,
                    modelName: 'InternetDocument',
                    calledMethod: 'save',
                    methodProperties: {
                        Sender: ttnData.sender,
                        Recipient: ttnData.recipient,
                        CitySender: ttnData.citySender,
                        CityRecipient: ttnData.cityRecipient,
                        Weight: ttnData.weight,
                        ServiceType: ttnData.serviceType,
                        Cost: ttnData.cost,
                        CargoType: ttnData.cargoType,
                        SeatsAmount: ttnData.seatsAmount,
                        Description: ttnData.description,
                        PayerType: ttnData.payerType,
                        PaymentMethod: ttnData.paymentMethod,
                    },
                });
    
                if (response.data && response.data.success) {
                    console.log('TTN created successfully:', response.data.data[0]);
                    return response.data.data[0]; // Return the created TTN details
                } else {
                    console.error('Failed to create TTN:', response.data.errors || response.data);
                    throw new Error('Failed to create TTN');
                }
            } catch (error) {
                console.error('Error creating TTN:', error.response?.data || error.message);
                throw new Error('Failed to create TTN');
            }
        }

        async getDocumentList(dateTimeFrom, dateTimeTo) {
            try {
                // Fetch all connections from the repository
                const connections = await connectionRepository.fetchAllConnections();
    
                if (!connections || connections.length === 0) {
                    console.log('No connections found.');
                    return [];
                }
    
                // Fetch documents for each connection
                const documentPromises = connections.map(async (connection) => {
                    console.log(`Fetching documents for connection: ${connection.name}`);
                    return await this.getDocumentListFromOneAccount(connection.token, dateTimeFrom, dateTimeTo);
                });
    
                // Wait for all document fetches to complete
                const documents = await Promise.all(documentPromises);
    
                // Flatten the array of documents (if each connection returns multiple documents)
                return documents.flat();
            } catch (error) {
                console.error('Error fetching document list:', error.message);
                throw error;
            }
        }

            /**
     * Fetch the document list from Nova Poshta.
     * @param {string} dateTimeFrom - The start date for the document list (format: DD.MM.YYYY).
     * @param {string} dateTimeTo - The end date for the document list (format: DD.MM.YYYY).
     * @returns {Object} - The response data from Nova Poshta.
     */
    async getDocumentListFromOneAccount(novaPostKey, dateTimeFrom, dateTimeTo) {
        try {
            const response = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
                apiKey: novaPostKey,
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