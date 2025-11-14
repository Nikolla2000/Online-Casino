import api from "../../axiosConfig";

export async function updatePreferences(data) {
    try {
        const res = api.patch('/user/notification-preferences', data, {
            withCredentials: true,
        });
        return res;
    } catch (err) {
        console.error('Error on request for updating preferences', err);
    }
}