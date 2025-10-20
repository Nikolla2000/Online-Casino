import { createSlice } from "@reduxjs/toolkit";

const initialState =  {
    showAiChatWidget: false,
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
        }
    }

});

export const {
    showChat,
    hideChat,
} = aiChatbotSlice.actions;
export default aiChatbotSlice.reducer;