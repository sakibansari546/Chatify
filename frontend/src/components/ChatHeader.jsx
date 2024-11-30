import React from 'react'

import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ChatHeader = ({ seletedUser }) => {
    const { friends, onlineUsers } = useSelector(state => state.user);
    const friend = friends?.find(friend => friend.username === seletedUser);


    return (
        <div className="p-2.5 border-b border-base-300 ">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="">
                        <div className=" rounded-full relative">
                            <img
                                src={friend?.profilePic || "https://placehold.co/100"}
                                alt="User profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            {/* Online status badge */}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 ${onlineUsers?.includes(friend?._id) ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}></div>
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">@{friend?.username}</h3>
                        <p className={`text-xs ${onlineUsers?.includes(friend?._id) ? 'text-green-500' : "text-gray-500"}`}>{onlineUsers?.includes(friend?._id) ? "online" : "offline"}</p>
                    </div>
                </div>
                {/* Close button */}
                <Link to={'/chat'} >
                    <X />
                </Link>
            </div>
        </div >
    )
}

export default ChatHeader