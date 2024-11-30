import { configureStore } from '@reduxjs/toolkit'

import themeReducer from './slices/themeSlice'
import userReducer from './slices/userSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
    reducer: {
        theme: themeReducer,
        user: userReducer,
        chat: chatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['user.socket'], // Ignore socket
                ignoredActionPaths: ['payload.socket'], // Ignore socket in actions
            },
        }),
});