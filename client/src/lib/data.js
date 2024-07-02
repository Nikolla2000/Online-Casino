import axios from "../axiosConfig";

export default async function fetchTotalCredits(userId) {
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