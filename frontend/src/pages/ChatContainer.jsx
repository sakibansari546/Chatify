import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import ChatHeader from '../components/ChatHeader'
import MessageInput from '../components/MessageInput'
import { getMessages, setSeletedUserChat } from '../store/actions/chatActions'
import { setSeletedUser } from '../store/slices/chatSlice'
import MessageSkeleton from '../components/skeletons/MessagesSkeleton'

const ChatContainer = () => {
    const username = useParams().username;
    const messageEndRef = useRef();
    const dispatch = useDispatch();

    const { friends, authUser } = useSelector(state => state.user);
    const { selectedUser, messages } = useSelector(state => state.chat);

    const selectedFriend = friends.find(friend => friend?.username === username);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            await dispatch(getMessages(selectedFriend?._id));
            dispatch(setSeletedUserChat(selectedFriend));
            setLoading(false);
        }
        fetchMessages();
    }, [getMessages, selectedFriend]);


    // Format message timestamp
    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedFriend])

    return (
        <div className='min-h-screen bg-base-100 py-10'>
            {/* <div className='fixed top-0'> */}
            <ChatHeader selectedFriend={selectedFriend} />
            {/* </div> */}

            <div className="flex-1 min-h-[80vh] overflow-y-auto p-4 space-y-4">
                {loading ? <MessageSkeleton /> :
                    messages?.map((message) => (
                        <div
                            key={message._id}
                            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                            ref={messageEndRef}
                        >
                            <div className=" chat-image avatar">
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

            <MessageInput selectedFriend={selectedFriend} />
        </div>
    )
}

export default ChatContainer
