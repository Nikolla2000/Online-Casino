import api from "../../axiosConfig";

export async function promptChatBot(data) {
  try {
    const res = await api.post('/v1/chatBot/', data);
    return res.data;
  } catch (err) {
    console.log("Error prompting chatbot: ", err);
  }
}


export async function fetchConversationHistory() {
  try {
    const res = await api.get('/v1/chatBot/');
    return res.data;
  } catch (err) {
    console.log("Error fetching conversation history: ", err);
  }
}


export async function deleteConversationHistory() {
  try {
    const res = await api.delete('/v1/chatbot/');
    return res.data;
  } catch (err) {
    console.log("Error requesting a delete of conversation history", err);
  }
}