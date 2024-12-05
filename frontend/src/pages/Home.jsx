import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Loader2, LoaderCircle, Send, CheckCircle, Clock } from 'lucide-react';
import { fetchSearchResult, sendFriendRequestAction } from '../store/actions/userActions';
import RecomendedUsers from '../components/RecomendedUsers';

const Home = () => {
    const dispatch = useDispatch();
    const { searchResult, authUser, pendingRequests } = useSelector((state) => state.user);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingRequests, setSendingRequests] = useState({}); // Object to track sending state for each user

    // Handle search input changes
    const handleChange = async (e) => {
        const value = e.target.value;
        setText(value);

        if (value.trim() === '') return; // Skip search if input is empty
        setLoading(true);
        await dispatch(fetchSearchResult(value));
        setLoading(false);
    };

    const handleSendReq = async (userId) => {
        setSendingRequests((prev) => ({ ...prev, [userId]: true })); // Set sending state for this user
        await dispatch(sendFriendRequestAction(userId));
        setSendingRequests((prev) => ({ ...prev, [userId]: false })); // Reset sending state for this user
    };

    // Check if user is already a friend
    const isFriend = (userId) => authUser?.friends?.includes(userId);
    // Check if friend request is pending
    const isPending = (userId) => pendingRequests?.some((req) => req._id == userId);

    return (
        <div>
            <div className="min-h-screen bg-base-200">
                <div className="pt-16 md:ml-[20vw] pb-">
                    <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl min-h-[calc(100vh-8rem)]">
                        <div className="rounded-lg overflow-hidden">
                            {/* Search Input */}
                            <div className="p-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="input input-bordered w-full max-w-md"
                                    onChange={handleChange}
                                    value={text}
                                />
                            </div>

                            {/* Search Result or Loading */}
                            <div className="p-4">
                                {loading ? (
                                    <div className="flex justify-center">
                                        <LoaderCircle size={30} className="animate-spin" />
                                    </div>
                                ) : searchResult.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {searchResult.map((user) => (
                                            <div
                                                key={user._id}
                                                className="p-2 flex items-center justify-between hover:bg-base-200 cursor-pointer bg-base-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-12 rounded-full">
                                                            <img
                                                                src={user.profilePic || 'https://placehold.co/100'}
                                                                alt="Profile"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium">@{user.username}</h3>
                                                        <p className="text-sm text-gray-500">{user.fullName}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    {/* Conditional Buttons */}
                                                    {isFriend(user._id) ? (
                                                        <button className="btn btn-disabled btn-circle">
                                                            <CheckCircle size={20} />
                                                        </button>
                                                    ) : isPending(user._id) ? (
                                                        <button className="btn btn-warning btn-circle">
                                                            <Clock size={20} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleSendReq(user._id)}
                                                            className="btn btn-primary btn-circle"
                                                        >
                                                            {sendingRequests[user._id] ? (
                                                                <Loader2 size={20} className="animate-spin" />
                                                            ) : (
                                                                <Send size={20} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    text && (
                                        <div className="text-center text-gray-500">
                                            No users found for "{text}"
                                        </div>
                                    )
                                )}
                            </div>

                            {!searchResult.length > 0 && !loading && (
                                <div className="">
                                    <RecomendedUsers />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
