import api from './api';

const adminService = {
    async getStats() {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    async getUsers() {
        const response = await api.get('/admin/users');
        return response.data;
    },
    async getPayments() {
        const response = await api.get('/admin/payments');
        return response.data;
    }
};

export default adminService;
