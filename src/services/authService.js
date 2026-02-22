import api from './api';

const authService = {
    async register({ email, name, phone, plan_type }) {
        const response = await api.post('/register', { email, name, phone, plan_type });
        return response.data;
    },

    async login(email, password) {
        const response = await api.post('/login', { email, password });
        return response.data;
    },

    async logout() {
        const response = await api.post('/logout');
        return response.data;
    },

    async getMe() {
        const response = await api.get('/me');
        return response.data;
    },
};

export default authService;
