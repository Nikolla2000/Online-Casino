import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    showAiChatWidget: false,
    conversationHistory: [],
    isChatbotTyping: false,
    showQuickQuestions: false,
    showDeleteConfirm: false,
    isLoading: false,
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
        },
        showDelete: (state) => {
            state.showDeleteConfirm = true;
        },
        hideDelete: (state) => {
            state.showDeleteConfirm = false;
        },
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
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
    showDelete,
    hideDelete,
    startLoading,
    stopLoading,
} = aiChatbotSlice.actions;
export default aiChatbotSlice.reducer;