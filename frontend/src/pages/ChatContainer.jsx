import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import ChatHeader from '../components/ChatHeader';
import MessageInput from '../components/MessageInput';
import { getMessages, setSeletedUserChat } from '../store/actions/chatActions';
import { setSeletedUser } from '../store/slices/chatSlice';
import MessageSkeleton from '../components/skeletons/MessagesSkeleton';

const ChatContainer = () => {
    const username = useParams().username;
    const messageEndRef = useRef();
    const dispatch = useDispatch();

    const { friends, authUser } = useSelector(state => state.user);
    const { selectedUser, messages, typingStatus } = useSelector(state => state.chat);

    const selectedFriend = friends.find(friend => friend?.username === username);

    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            await dispatch(getMessages(selectedFriend?._id));
            dispatch(setSeletedUserChat(selectedFriend));
            setLoading(false);
        };
        fetchMessages();
    }, [dispatch, getMessages, selectedFriend]);

    // Update `isTyping` whenever typingStatus or selectedFriend changes
    useEffect(() => {
        if (selectedFriend) {
            setIsTyping(typingStatus[selectedFriend._id]);
        }
    }, [typingStatus, selectedFriend]);

    // Format message timestamp
    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    const groupMessagesByDate = (messages) => {
        return messages.reduce((groups, message) => {
            const date = new Date(message.createdAt).toDateString();
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
            return groups;
        }, {});
    };

    const groupedMessages = groupMessagesByDate(messages);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedFriend]);


    return (
        <div className="min-h-screen bg-base-100 py-10">
            <ChatHeader selectedFriend={selectedFriend} />

            <div className="flex-1 min-h-[80vh] overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <MessageSkeleton />
                ) : (
                    Object.keys(groupedMessages).map((date) => (
                        <div key={date}>
                            <div className="text-center text-sm py-2 rounded-md mb-4">{date}</div>
                            {groupedMessages[date].map((message) => (
                                <div
                                    key={message._id}
                                    className={`chat ${message.senderId === authUser._id ? 'chat-end' : 'chat-start'
                                        }`}
                                    ref={messageEndRef}
                                >
                                    <div className="chat-image avatar">
                                        <div className="size-10 rounded-full border">
                                            <img
                                                src={
                                                    message.senderId === authUser._id
                                                        ? authUser?.profilePic
                                                        : selectedFriend?.profilePic
                                                }
                                                alt="profile pic"
                                            />
                                        </div>
                                    </div>
                                    <div className="chat-header mb-1">
                                        <time className="text-xs opacity-50 ml-1">
                                            {formatMessageTime(message?.createdAt)}
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
                                        {message.text && <p>{message.text}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
            
            {isTyping && (
                <div className="flex items-center justify-center w-full fixed bottom-10 bg-base-100">
                    <div className="text-md text-primary pb-2">
                        <p>Typing...</p>
                    </div>
                </div>
            )}

            {/* Display isTyping */}


            <MessageInput selectedFriend={selectedFriend} />
        </div>
    );
};

export default ChatContainer;
