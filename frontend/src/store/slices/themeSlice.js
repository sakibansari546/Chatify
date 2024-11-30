import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    theme: localStorage.getItem("chat-theme") || 'coffee',
}

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("chat-theme", action.payload);
        }
    },
})

// Action creators are generated for each case reducer function
export const { setTheme } = themeSlice.actions

export default themeSlice.reducer