import { Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchFriends } from '../store/actions/userActions';

const Chat = () => {
    const dispath = useDispatch();
    const { friends, authUser, onlineUsers } = useSelector(state => state.user);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getFriends() {
            if (authUser) {
                await dispath(fetchFriends());
            }
        }
        getFriends();
    }, [fetchFriends]);

    return (
        <aside className="min-h-screen pt-20">
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
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">{`(0 online)`}</span>
                </div>

                {/* User Cards */}
                <div className="mt-6 space-y-4 pb-20">
                    {
                        !friends.length ? (
                            <div className="flex items-center justify-center">
                                <span className="text-sm text-zinc-500">No friends found</span>
                            </div>
                        ) : friends.map((friend) => (
                            <Link to={`/chat/${friend.username}`} key={friend._id} className="flex gap-4 items-center bg-base-100 py-3 px-2">
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
                                    <p className={`text-xs ${onlineUsers.includes(friend._id) ? 'text-green-500' : "text-gray-500"}`}>{onlineUsers.includes(friend._id) ? "online" : "offline"}</p>
                                </div>
                            </Link>
                        ))
                    }



                    {/* Sample Offline User Card */}
                    {/* <Link to={`/chat/someone`} className="flex gap-4 items-center bg-base-100 py-3 px-2 ">
                        <div className="relative">
                            <img
                                src="https://via.placeholder.com/50"
                                alt="User profile"
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            Offline status badge
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="mt-2 ">
                            <p className="text-sm font-medium">Username</p>
                            <p className="text-xs text-gray-500">Offline</p>
                        </div>
                    </Link> */}
                </div>
            </div>
        </aside >
    )
}

export default Chat
