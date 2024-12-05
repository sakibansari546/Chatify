import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPendingRequests, acceptFriendRequestAction, rejectFriendRequestAction } from '../store/actions/userActions'; // Import reject action
import { Loader2 } from 'lucide-react'; // Loader for loading state

const Notification = () => {
    const dispatch = useDispatch();
    const { pendingRequests } = useSelector(state => state.user);
    const [loading, setLoading] = useState({}); // Object to track loading state for each request
    const [fetchLoading, setFetchLoading] = useState(false);

    const handleAcceptRequest = async (userId) => {
        setLoading((prev) => ({ ...prev, [userId]: true })); // Set loading state for this request
        await dispatch(acceptFriendRequestAction(userId)); // Call accept request action
        setLoading((prev) => ({ ...prev, [userId]: false })); // Reset loading state for this request
    };

    const handleRejectRequest = async (userId) => {
        setLoading((prev) => ({ ...prev, [userId]: true })); // Set loading state for this request
        await dispatch(rejectFriendRequestAction(userId)); // Call reject request action
        setLoading((prev) => ({ ...prev, [userId]: false })); // Reset loading state for this request
    };

    useEffect(() => {
        setFetchLoading(true); // Set loading state for fetching pending requests
        dispatch(fetchPendingRequests()).then(() => setFetchLoading(false)); // Fetch pending requests and reset loading state
    }, [pendingRequests]);

    return (
        <div className='w-full min-h-screen p-4 pt-20 bg-base-100'>
            <h1 className='pb-2 text-2xl font-semibold'>Notifications</h1>

            <div className='flex flex-col gap-3 mt-4 mx-'>
                {
                    fetchLoading ? (
                        <div className="flex justify-center items-center h-16">
                            <Loader2 size={30} className="animate-spin" />
                        </div>
                    ) :
                        !pendingRequests.length ?
                            <p className='text-center'>No notifications</p>
                            : pendingRequests.map((request, index) => (
                                <div key={index} className="p-2 flex items-center justify-between hover:bg-base-100 cursor-pointer bg-base-200">
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img src={request.profilePic || "https://placehold.co/100"} alt="Profile" />
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">@{request.username}</h3>
                                            <p className="text-sm text-gray-500">Friend Request</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Accept Request Button */}
                                        <button
                                            onClick={() => handleAcceptRequest(request._id)}
                                            className="btn btn-primary btn-circle text-lg"
                                            disabled={loading[request._id]} // Disable button if loading
                                        >
                                            {loading[request._id] ? <Loader2 className="animate-spin" size={20} /> : "✓"}
                                        </button>
                                        {/* Reject Request Button */}
                                        <button
                                            onClick={() => handleRejectRequest(request._id)}
                                            className="btn btn-error btn-circle text-lg"
                                            disabled={loading[request._id]} // Disable button if loading
                                        >
                                            {loading[request._id] ? <Loader2 className="animate-spin" size={20} /> : "✕"}
                                        </button>
                                    </div>
                                </div>
                            ))
                }
            </div>
        </div >
    );
};

export default Notification;
