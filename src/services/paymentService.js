import api from './api';

const paymentService = {
    async checkStatus(uuid) {
        const response = await api.get(`/payment/status/${uuid}`);
        return response.data;
    },
};

export default paymentService;
