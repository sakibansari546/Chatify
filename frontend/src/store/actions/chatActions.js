import axios from 'axios';
import { toast } from 'react-hot-toast';
import { io } from "socket.io-client";
import { addMessage, setCurrentChat, setMessages } from '../slices/chatSlice';

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const fetchMessages = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/chat/get-messages/${userId}`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setMessages({ chatId: userId, messages: res.data.messages }));
            dispatch(setCurrentChat(userId));
        }
    } catch (error) {
        console.log(error);

    }
}

export const sendMessage = (userId, formData) => async (dispatch) => {
    try {
        const res = await axios.post(`${baseURL}/chat/send-message/${userId}`, formData, { withCredentials: true });
        if (res.data.success) {
            dispatch(addMessage({ chatId: userId, message: res.data.newMessage }));
        }
    } catch (error) {
        console.log("sned Message error", error);
    }
}