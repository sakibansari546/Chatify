import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Clock, Loader, Loader2, Send } from 'lucide-react';
import { fetchRecomendedUsers, sendFriendRequestAction } from '../store/actions/userActions';

const RecomendedUsers = () => {
    const dispatch = useDispatch();
    const { recomendedUsers, authUser, pendingRequests } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const [sendingRequests, setSendingRequests] = useState({}); // Object to track sending state for each user

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true); // Start loader
            await dispatch(fetchRecomendedUsers()); // Wait for API response
            setLoading(false); // Stop loader
        };
        fetchUsers();
    }, [dispatch]); // Dispatch ko dependency mein rakho


    const handleSendReq = async (userId) => {
        setSendingRequests((prev) => ({ ...prev, [userId]: true })); // Set sending state for this user
        await dispatch(sendFriendRequestAction(userId));
        setSendingRequests((prev) => ({ ...prev, [userId]: false })); // Reset sending state for this user
    };

    // Check if user is already a friend
    const isFriend = (userId) => authUser?.friends?.includes(userId);

    // Check if friend request is pending
    const isPending = (userId) => pendingRequests?.some((req) => req._id == userId);

    // Show search result if available; otherwise, recommended users
    // const filteredUsers = searchResult.length > 0 ? searchResult : recomendedUsers;

    return (
        <div>
            <h1 className='px-4 text-xl font-medium'>Recommended</h1>
            <div className="flex flex-col gap-3 mt-4 mx-4">
                {loading ? (
                    <div className="flex justify-center items-center h-16">
                        <p>Loading...</p> {/* Loader */}
                    </div>
                ) : (
                    recomendedUsers?.map((user) => (
                        <div
                            key={user._id}
                            className="p-2 flex items-center justify-between hover:bg-base-200 cursor-pointer bg-base-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="w-12 rounded-full">
                                        <img
                                            src={user?.profilePic || 'https://placehold.co/100'}
                                            alt="Profile"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium">@{user?.username}</h3>
                                    <p className="text-sm text-gray-500">{user?.fullName}</p>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default RecomendedUsers;
