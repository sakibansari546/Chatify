import React, { useRef, useState } from 'react'
import ChatHeader from '../components/ChatHeader'
import MessageInput from '../components/MessageInput'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ChatContainer = () => {
    const seletedUser = useParams().seletedUser;

    const { friends } = useSelector(state => state.user);
    // Message data state
    const [messages, setMessages] = useState([])
    const [authUser, setAuthUser] = useState({
        _id: '',
        profilePic: ''
    });

    const [selectedUser, setSelectedUser] = useState({
        profilePic: ''
    })
    const messageEndRef = useRef()

    // Format message timestamp
    const formatMessageTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        })
    }

    return (
        <div className='min-h-screen bg-base-100'>
            {/* <div className='fixed top-0'> */}
            <ChatHeader seletedUser={seletedUser} />
            {/* </div> */}

            <div className="flex-1 min-h-[80vh] overflow-y-auto p-4 space-y-4">
                {messages?.map((message) => (
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
                                            ? authUser.profilePic || "/avatar.png"
                                            : selectedUser.profilePic || "/avatar.png"
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
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput selectedUser={selectedUser} />
        </div>
    )
}

export default ChatContainer
