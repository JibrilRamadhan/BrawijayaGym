import api from './api';

const authService = {
    async register(username, email, password) {
        const response = await api.post('/register', { username, email, password });
        return response.data;
    },

    async login(login, password) {
        const response = await api.post('/login', { login, password });
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
