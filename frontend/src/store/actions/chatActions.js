import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseURL } from './userActions';
import { addMessage, setMessages, setSeletedUser } from '../slices/chatSlice';

export const getMessages = (userId) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseURL}/chat/get-messages/${userId}`, { withCredentials: true });
        if (res.data.success) {
            dispatch(setMessages(res.data.messages));
        }
    } catch (error) {
        console.error(error);
    }
}

export const setSeletedUserChat = (seletedUser) => async (dispatch) => {
    dispatch(setSeletedUser(seletedUser))
}

export const sendNewMessage = (userId, message) => async (dispatch) => {
    try {
        const res = await axios.post(`${baseURL}/chat/send-message/${userId}`, message, { withCredentials: true });
        if (res.data.success) {
            dispatch(addMessage(res.data.message));
        }
    } catch (error) {
        toast.error(error.response.data.message);
    }
}

export const sendRealtimeMessage = () => async (dispatch, getState) => {
    const { user } = getState();
    const { socket } = user;

    if (socket) {
        socket.on("newMessage", (data) => {
            dispatch(addMessage(data));
        });

        return () => {
            socket.off("newMessage");
        };
    }
}

