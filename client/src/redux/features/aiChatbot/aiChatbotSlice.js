import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    showAiChatWidget: false,
    conversationHistory: [],
    isChatbotTyping: false,
    showQuickQuestions: false,
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
        },
        startChatbotTyping: (state) => {
            state.isChatbotTyping = true;
        },
        stopChatbotTyping: (state) => {
            state.isChatbotTyping = false;
        },
        setShowQuickQuestions: (state) => {
            state.showQuickQuestions = true;
        },
        hideQuickQuestions: (state) => {
            state.showQuickQuestions = false;
        }
    }

});

export const {
    showChat,
    hideChat,
    addMessage,
    setConversationHistory,
    startChatbotTyping,
    stopChatbotTyping,
    setShowQuickQuestions,
    hideQuickQuestions,
} = aiChatbotSlice.actions;
export default aiChatbotSlice.reducer;