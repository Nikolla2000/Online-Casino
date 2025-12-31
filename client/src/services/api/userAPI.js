import api from "../../axiosConfig";

export const userAPI = {
    updatePreferences: async (data) => {
        try {
            const res = await api.patch('/user/notification-preferences', data, {
                withCredentials: true,
            });
            return res;
        } catch (err) {
            console.error('Error on request for updating preferences', err);
        }
    },

    getTotalCredits: async () => {
        try {
            const res = await api.get('/user/totalCredits');
            return res;      
        } catch (err) {
            console.error('Error on request for fetching total credits: ', err);
        }
    },

    getUserStats: async () => {
        const res = await api.get('/user/stats');
        return res.data;
    },

    getRecentActivity: async () => {
        const res = await api.get('/user/recent-activity');
        return res.data.recentActivity;
    },

    getGameHisory: async(page, limit) => {
        const res = await api.get(`/user/game-history?page=${page}&limit=${limit}`);
        return res.data;
    }
};