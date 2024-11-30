import React, { useEffect, useRef } from 'react'
import ChatHeader from '../components/ChatHeader'
import MessageInput from '../components/MessageInput'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMessages } from '../store/actions/chatActions'

const ChatContainer = () => {
    const { selectedUser } = useParams();
    const dispatch = useDispatch();

    const { friends, authUser } = useSelector(state => state.user);
    const { messages } = useSelector(state => state.chat);

    const friend = friends?.find(friend => friend.username === selectedUser);


    useEffect(() => {
        const callingFn = async () => {
            await dispatch(fetchMessages(friend._id));
        }
        callingFn()
    }, [selectedUser, friend, dispatch]);

    const messageEndRef = useRef();

    // Format message timestamp
    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
    };

    // Format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const groupMessagesByDate = (messages = []) => {
        if (!Array.isArray(messages)) return {}; // Ensure valid input
        return messages?.reduce((grouped, message) => {
            const date = new Date(message?.createdAt).toDateString();
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(message);
            return grouped;
        }, {});
    };


    // Scroll to the bottom when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const groupedMessages = friend?._id ? groupMessagesByDate(messages[friend._id] || []) : {};


    return (
        <div className='min-h-screen bg-base-100'>
            <ChatHeader seletedUser={selectedUser} />
            <div className="flex-1 min-h-[80vh] overflow-y-auto p-4 space-y-4">
                {Object.entries(groupedMessages).map(([date, messages]) => (
                    <div key={date}>
                        {/* Display the date */}
                        <div className="text-center text-sm text-gray-500 mb-4">
                            {formatDate(messages[0]?.createdAt)}
                        </div>
                        {/* Display messages for this date */}
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`chat ${message.sender === authUser._id ? "chat-end" : "chat-start"}`}
                                ref={messageEndRef}
                            >
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img
                                            src={
                                                message.sender === authUser._id
                                                    ? authUser.profilePic || "/avatar.png"
                                                    : friend.profilePic || "/avatar.png"
                                            }
                                            alt="profile pic"
                                        />
                                    </div>
                                </div>
                                <div className="chat-header mb-1">
                                    <time className="text-xs opacity-50 ml-1">
                                        {formatMessageTime(message.createdAt)}
                                    </time>
                                </div>
                                <div className="chat-bubble flex flex-col">
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="sm:max-w-[200px] rounded-md mb-2"
                                        />
                                    )}
                                    {message.content && <p>{message.content}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <MessageInput friend={friend} />
        </div>
    );
}

export default ChatContainer;
