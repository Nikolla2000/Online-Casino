import api from "../axiosConfig";
import axios from "../axiosConfig";

export async function fetchTotalCredits(userId) {
  try {
    const response = await axios.get('/v1/user/getTotalCredits', {
      params: {
        id: userId
      }
    });
    return response.data.totalCredits;
  } catch (error) {
    console.log('Error fetching total credits: ', error);
  }
}

export function updateTotalCredits(userId, amount) {
  try {
    axios.put('/v1/user/updateCredits', {userId, totalCredits: amount});
  } catch (error) {
    console.error('Error updating total credits: ', error);
  }
}


export async function fetchOnlineUsers() {
  try {
    const res = await api.get('/v1/user/online');
    return res.data;
  } catch (err) {
    console.error('Error fetching online users: ', err);
  }
}
