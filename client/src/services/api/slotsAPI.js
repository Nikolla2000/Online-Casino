import api from "../../axiosConfig";

export const slotsAPI = {
    fetchPlaySlotsRound: async (data) => {
        try {
            const res = await api.post('/slots/', data);
            return res;
        } catch (err) {
            console.error('Error on making slots game request:', err);
        }
    }
}