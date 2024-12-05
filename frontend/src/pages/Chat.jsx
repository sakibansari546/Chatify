import { MessageCircleIcon, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchFriends } from '../store/actions/userActions';

const Chat = () => {
    const dispath = useDispatch();
    const { friends, authUser, onlineUsers } = useSelector(state => state.user);
    const { typingStatus } = useSelector(state => state.chat);
    const [loading, setLoading] = useState(false);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        async function getFriends() {
            if (authUser) {
                setLoading(true);
                await dispath(fetchFriends());
                setLoading(false);
            }
        }
        getFriends();
    }, [fetchFriends]);

    const onlineFriends = friends.filter((friend) => onlineUsers.includes(friend._id));
    const filteredOnlineFriends = showOnlineOnly ? onlineFriends : friends;

    return (
        <aside className="min-h-screen pt-20 bg-base-100">
            <div className='px-6'>
                <div className="flex items-center gap-2">
                    <Users className="size-6" />
                    <span className="font-medium lg:block">Contacts</span>
                </div>

                {/* TODO: Online filter toggle */}
                <div className="mt-3 flex lg:flex items-center gap-2 ">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineFriends.length} online)</span>
                </div>

                {/* User Cards */}
                <div className="mt-6 space-y-4 pb-20">
                    {
                        !filteredOnlineFriends.length ? (
                            <div className="flex items-center justify-center">
                                <span className="text-sm text-zinc-500">No friends found</span>
                            </div>
                        ) : filteredOnlineFriends.map((friend) => (
                            <Link to={`/chat/${friend.username}`} key={friend._id} className="flex gap-4 items-center bg-base-200 py-3 px-2">
                                <div className="relative">
                                    <img
                                        src={friend.profilePic || "https://placehold.co/100"}
                                        alt="User profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    {/* Online status badge */}
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 ${onlineUsers.includes(friend._id) ? "bg-green-500" : "bg-gray-400"} rounded-full border-2 border-white`}></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-md font-medium">@{friend.username}</p>
                                    <p className={`text-xs ${onlineUsers.includes(friend._id) ? 'text-green-500' : "text-gray-500"}`}>
                                        {typingStatus[friend._id] ? "Typing..." : onlineUsers.includes(friend._id) ? "online" : "offline"}
                                    </p>
                                </div>
                                <div className="flex-1 flex justify-end">
                                    <button className="btn btn-primary btn-circle">
                                        <MessageCircleIcon />
                                    </button>
                                </div>
                            </Link>
                        ))
                    }

                </div>
            </div>
        </aside >
    )
}

export default Chat
