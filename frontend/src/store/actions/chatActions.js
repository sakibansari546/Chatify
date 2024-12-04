import axios from 'axios';
import { toast } from 'react-hot-toast';
import { baseURL } from './userActions';
import { setMessages } from '../slices/chatSlice';

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