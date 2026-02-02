import api from "../../axiosConfig";

export const userAPI = {
    updatePreferences: async (data) => {
        try {
            const res = await api.patch('/v1/user/notification-preferences', data, {
                withCredentials: true,
            });
            return res;
        } catch (err) {
            console.error('Error on request for updating preferences', err);
        }
    },

    getTotalCredits: async (userId) => {
        try {
            const res = await api.get(`/v2/users/${userId}/credits`);
            return res;      
        } catch (err) {
            console.error('Error on request for fetching total credits: ', err);
        }
    },

    getUserStats: async () => {
        const res = await api.get('/v1/user/stats');
        return res.data;
    },

    getRecentActivity: async () => {
        const res = await api.get('/v1/user/recent-activity');
        return res.data.recentActivity;
    },

    getGameHisory: async(page, limit) => {
        const res = await api.get(`/v1/user/game-history?page=${page}&limit=${limit}`);
        return res.data;
    },

    fetchOnlineUsers: async() => {
        try {
            const res = await api.get('/v2/users?online=true');
            return res.data;
        } catch (err) {
            console.error('Error fetching online users: ', err);
        }
    },

    getUserData: async() => { 
        try {
            const pathParts = window.location.pathname.split('/');
            const userId = pathParts[2];
    
            const res = await api.get(`/v2/users/${userId}`);
            return res.data;
        } catch (err) {
            console.error('Error fetching user data: ', err);
        }
    }
};