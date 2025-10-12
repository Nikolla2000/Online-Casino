import api from "../../axiosConfig";

export async function promptChatBot (data) {
  try {
    const res = await api.post('/chatBot/', data);
    return res.data;
  } catch (err) {
    console.log("Error prompting chatbot: ", err);
  }
}