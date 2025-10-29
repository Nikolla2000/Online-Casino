import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    showAiChatWidget: false,
    conversationHistory: [],
}

const aiChatbotSlice = createSlice({
    name: 'aiChatbot',
    initialState,
    reducers: {
        showChat: (state) => {
            state.showAiChatWidget = true;
        },
        hideChat: (state) => {
            state.showAiChatWidget = false;
        },
        setConversationHistory: (state, action) => {
            state.conversationHistory = action.payload;
        },
        addMessage: (state, action) => {
            state.conversationHistory.push(action.payload);
        }
    }

});

export const {
    showChat,
    hideChat,
    addMessage,
    setConversationHistory,
} = aiChatbotSlice.actions;
export default aiChatbotSlice.reducer;