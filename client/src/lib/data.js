import axios from "../axiosConfig";

export async function fetchTotalCredits(userId) {
  try {
    const response = await axios.get('user/getTotalCredits', {
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
    axios.put('user/updateCredits', {userId, totalCredits: amount});
  } catch (error) {
    console.error('Error updating total credits: ', error);
  }
}

