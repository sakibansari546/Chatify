import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentChat: null,
    messages: [],
    typingStatus: {},
    seenStatus: {},
    loading: false,
    error: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
        setMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            state.messages = {
                ...state.messages, // Preserve existing messages
                [chatId]: messages,
            };
        },

        addMessage: (state, action) => {
                const { chatId, message } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            state.messages[chatId] = [...state.messages[chatId], message]; // Immutable update
        },


        setTypingStatus: (state, action) => {
            const { chatId, isTyping } = action.payload;
            state.typingStatus[chatId] = isTyping;
        },
        setSeenStatus: (state, action) => {
            const { chatId, seen } = action.payload;
            state.seenStatus[chatId] = seen;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

// Action creators
export const {
    setCurrentChat,
    setMessages,
    addMessage,
    setTypingStatus,
    setSeenStatus,
    setLoading,
    setError,
} = chatSlice.actions;

export default chatSlice.reducer;
