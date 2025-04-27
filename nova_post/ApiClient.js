class NovaPost {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.novaposhta.ua/v2.0/';
        this.axios = require('axios').create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }

    async makeRequest(method, modelName, methodName, params = {}) {
        try {
            const response = await this.axios.post('', {
                modelName: modelName,
                calledMethod: methodName,
                methodProperties: params,
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
    }

    // Example method to get cities
    async getCities() {
        return await this.makeRequest('GET', 'Address', 'getCities');
    }

    // Example method to get warehouses
    async getWarehouses(cityRef) {
        return await this.makeRequest('GET', 'Address', 'getWarehouses', { CityRef: cityRef });
    }
}

module.exports = NovaPost;