import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from "socket.io-client";
import { setAuthUser, setCheckingAuth, setFriends, setOnlineUsers, setPendingRequests, setRecomendedUsers, setSearchResult, setSocket } from '../slices/userSlice';

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const checkAuth = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/check-auth`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(res.data.user)); // Set auth user in state
            dispatch(connectSocket())
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Authentication failed');
        dispatch(disconnectSocket())
    } finally {
        dispatch(setCheckingAuth(false)); // Update loading state
    }
};

export const signup = (userData) => async (dispatch) => {
    try {
        const res = await axios.post(`${baseURL}/auth/signup`, userData, { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(res.data.user)); // Set auth user in state
            toast.success(res.data.message); // Show success toast
            dispatch(connectSocket())
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
        dispatch(setCheckingAuth(false)); // Update loading state
    }
};


export const login = (userData) => async (dispatch) => {
    try {
        const res = await axios.post(`${baseURL}/auth/login`, userData, { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(res.data.user)); // Set auth user in state
            toast.success(res.data.message); // Show success toast
            dispatch(connectSocket())
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
    } finally {
        dispatch(setCheckingAuth(false)); // Update loading state
    }
};

export const logout = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/logout`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(null)); // Set auth user in state
            toast.success(res.data.message); // Show success toast
            dispatch(disconnectSocket());
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Logout failed');
    } finally {
        dispatch(setCheckingAuth(false)); // Update loading state
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        const res = await axios.put(`${baseURL}/auth/update-profile`, userData, { withCredentials: true });
        if (res.data.success) {
            dispatch(setAuthUser(res.data.user)); // Set auth user in state
            toast.success(res.data.message); // Show success toast
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Profile update failed');
    }
};

export const fetchRecomendedUsers = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/recommended-users`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setRecomendedUsers(res.data.users)); // Set auth user in state
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Fetch recomended user failed!');
    }
};

export const fetchSearchResult = (query) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/search?query=${query}`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setSearchResult(res.data.users)); // Set auth user in state
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Fetch search result failed!');
    }
};

export const fetchFriends = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/get-friends`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setFriends(res.data.friends)); // Set auth user in state
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Fetch friends failed!');
    }
};

export const fetchPendingRequests = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/get-pending-requests`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setPendingRequests(res.data.pendingRequests)); // Set auth user in state
        }
    } catch (error) {
        toast.error(error.response?.data?.message || 'Fetch pending requests failed!');
    }
};

export const sendFriendRequestAction = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/send-friend-request/${userId}`, { withCredentials: true });
        if (res.data.success) {
            // Update pendingRequests in Redux store
            dispatch(setPendingRequests(res.data.pendingRequests)); // Set entire pendingRequests array
            toast.success(res.data.message || "Friend request sent successfully!"); // Success message
            // dispatch(sendRealtimeRequest());
        }
    } catch (error) {
        // Error handling
        const errorMessage = error.response?.data?.message || "Send friend request failed!";
        toast.error(errorMessage);
        console.error("Friend request error:", error); // Optional: Log for debugging
    }
};

export const acceptFriendRequestAction = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/auth/accept-friend-request/${userId}`, { withCredentials: true });
        if (res.data.success) {
            // Update pendingRequests in Redux store
            dispatch(setFriends(res.data.friends)); // Set entire pendingRequests array
            dispatch(setPendingRequests(res.data.pendingRequests));
            toast.success(res.data.message || "Friend request accepted successfully!"); // Success message
            // dispatch(acceptRealtimeRequest());
        }
    } catch (error) {
        // Error handling
        const errorMessage = error.response?.data?.message || "Accept friend request failed!";
        toast.error(errorMessage);
        console.error("Accept friend request error:", error); // Optional: Log for debugging
    }
};

// rejectFriendRequestAction.js
export const rejectFriendRequestAction = (userId) => async (dispatch, getState) => {
    try {
        const res = await axios.get(`${baseURL}/auth/reject-friend-request/${userId}`, { withCredentials: true });
        if (res.data.success) {
            // Update pendingRequests locally by filtering out the rejected user
            const { pendingRequests } = getState().user;
            const updatedRequests = pendingRequests.filter(request => request._id !== userId);

            // Update Redux store
            dispatch(setPendingRequests(res.data.pendingRequests)); // Update local state instantly
            toast.success(res.data.message || "Friend request rejected successfully!");
        }
    } catch (error) {
        // Error handling
        const errorMessage = error.response?.data?.message || "Reject friend request failed!";
        toast.error(errorMessage);
        console.error("Reject friend request error:", error);
    }
};

export const connectSocket = () => async (dispatch, getState) => {
    const { user } = getState();
    const { authUser } = user;

    console.log(user.onlineUsers);


    if (!authUser) {
        console.error("User not authenticated. Cannot connect socket.");
        return;
    }

    // Initialize socket connection
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
        query: { userId: authUser._id },
        // transports: ['websocket'], // Ensure stable connection
    });


    // Handle socket events
    socket.on("connect", () => {
        dispatch(setSocket(socket));
        // console.log("Socket connected:", socket.id);
    });

    socket.on("getOnlineUsers", (userIds) => {
        dispatch(setOnlineUsers(userIds));
    })

    socket.on("disconnect", () => {
        // console.log("Socket disconnected");
    });

    // Save socket instance in Redux
    dispatch(setSocket(socket));
};

export const disconnectSocket = () => async (dispatch, getState) => {
    const { user } = getState();
    const { socket } = user;

    if (socket) {
        socket.disconnect();
        dispatch(setSocket(null));
        socket.on("getOnlineUsers", (userIds) => {
            dispatch(setOnlineUsers(userIds));
        })
        console.log("Socket disconnected");
    }
};

export const sendRealtimeRequest = () => async (dispatch, getState) => {
    const { user } = getState();
    const { socket } = user;

    if (socket) {
        socket.on("newFriendRequest", (data) => {
            toast.success("You have a new friend request!");
            dispatch(setPendingRequests(data.pendingRequests));
        });

        return () => {
            socket.off("newFriendRequest");
        };
    }
}

export const acceptRealtimeRequest = () => async (dispatch, getState) => {
    const { user } = getState();
    const { socket } = user;

    if (socket) {
        // Bind only once to avoid duplicate listeners
        socket.off("requestAccepted"); // Prevent multiple listeners
        socket.on("requestAccepted", (data) => {
            console.log("Request Accepted Real-time:", data); // Debug log
            toast.success(`${data.userName} request has been accepted!`);
            dispatch(setFriends(data.friends));
            dispatch(setPendingRequests(data.pendingRequests));
        });
    }
};
