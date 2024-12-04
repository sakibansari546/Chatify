import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: [],
    seletedUser: null,
}

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages = [...state.messages, action.payload]
        },
        setSeletedUser: (state, action) => {
            state.seletedUser = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { setMessages, addMessage, setSeletedUser } = chatSlice.actions

export default chatSlice.reducer