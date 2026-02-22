import api from './api';

const subscriptionService = {
    async getPlans() {
        const response = await api.get('/plans');
        return response.data;
    },

    async joinPlan(plan_id, name, phone, days = null, memberData = null) {
        const payload = { plan_id, name, phone };
        if (days) payload.days = days;
        if (memberData) {
            payload.first_name = memberData.first_name;
            payload.last_name = memberData.last_name;
            payload.middle_name = memberData.middle_name;
            payload.jenis_kelamin = memberData.jenis_kelamin;
            payload.alamat = memberData.alamat;
        }
        const response = await api.post('/subscriptions/join', payload);
        return response.data;
    },
};

export default subscriptionService;
