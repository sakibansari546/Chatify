import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    authUser: null,
    isCheckingAuth: true,
    friends: [],
    pendingRequests: [],
    recomendedUsers: [],
    searchResult: [],
    onlineUsers: [],
    socket: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthUser(state, action) {
            state.authUser = action.payload;
        },
        setCheckingAuth(state, action) {
            state.isCheckingAuth = action.payload;
        },
        setRecomendedUsers(state, action) {
            state.recomendedUsers = action.payload;
        },
        setFriends(state, action) {
            state.friends = action.payload;
        },
        setSearchResult(state, action) {
            state.searchResult = action.payload;
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
        setPendingRequests(state, action) {
            state.pendingRequests = action.payload;
        },
        setSocket(state, action) {
            state.socket = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setAuthUser, setCheckingAuth, setRecomendedUsers, setFriends, setOnlineUsers, setSearchResult, setPendingRequests, setSocket } = userSlice.actions;

export default userSlice.reducer;
