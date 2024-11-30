import { Send, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchFriends } from '../store/actions/userActions';

const Friends = () => {
    const dispath = useDispatch();
    const { friends, authUser } = useSelector(state => state.user)
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getFriends() {
            if (authUser) {
                await dispath(fetchFriends());
            }
        }
        getFriends()
    }, [fetchFriends])

    const handleSendMessage = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <div className="min-h-screen bg-base-200">
                <div className="pt-16 md:ml-[20vw] pb-16">
                    <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl min-h-[calc(100vh-8rem)]">
                        <div className="rounded-lg overflow-hidden">
                            <div className="p-4 border-b ">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="input input-bordered w-full max-w-md"
                                    onChange={(e) => setText(e.target.value)}
                                    value={text}
                                />
                            </div>

                            <div className='px-4 text-xl font-medium py-4 flex items-center gap-2'>
                                <Users className='font-bold' />
                                <h1>Friends</h1>
                            </div>

                            <div className='flex flex-col gap-3 mt-2 mx-4'>
                                {
                                    !friends.length ? "No friends"
                                        : friends.map((friend) => (
                                            <div key={friend._id} className="p-2 flex items-center justify-between hover:bg-base-200 cursor-pointer bg-base-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 rounded-full">
                                                            <img src={friend.profilePic || "https://placehold.co/100"} alt="Profile" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">@{friend.username}</h3>
                                                        <p className="text-sm text-gray-500">{friend.fullName}</p>
                                                    </div>
                                                </div>
                                                <button className="btn btn-primary btn-circle">
                                                    <Send size={20} />
                                                </button>
                                            </div>
                                        ))
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Friends
