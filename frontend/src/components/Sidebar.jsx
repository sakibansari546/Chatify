import { Bell, Home, MessageCircle, Users } from 'lucide-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

const Sidebar = () => {
    const { pendingRequests, authUser } = useSelector(state => state.user);

    return (
        <>
            <aside className='bg-base-100 w-full sm:w-[15%] md:w-[20%] lg:w-[15%] rounded-md sm:h-[80vh] fixed bottom-0 left-0 sm:left-4 md:left-6 lg:left-8 sm:top-24 sm:bottom-auto z-50'>
                <div className='flex flex-row sm:flex-col items-center justify-around sm:justify-start w-full'>

                    {/* Home Link */}
                    <NavLink
                        to='/'
                        className={({ isActive }) =>
                            `py-4 px-8 cursor-pointer w-full ${isActive ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`
                        }
                    >
                        <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                            <Home size={25} />
                            <span className='hidden md:block text-lg'>Home</span>
                        </div>
                    </NavLink>

                    {/* Chat Link */}
                    <NavLink
                        to='/chat'
                        className={({ isActive }) =>
                            `py-4 px-8 cursor-pointer w-full ${isActive ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`
                        }
                    >
                        <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                            <MessageCircle size={25} />
                            <span className='hidden md:block text-lg'>Message</span>
                        </div>
                    </NavLink>

                    {/* Friends Link */}
                    <NavLink
                        to={`/${authUser?.username}/friends`}
                        className={({ isActive }) =>
                            `py-4 px-8 cursor-pointer w-full ${isActive ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`
                        }
                    >
                        <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                            <Users size={25} />
                            <span className='hidden md:block text-lg'>Friends</span>
                        </div>
                    </NavLink>

                    {/* Notification Link */}
                    <NavLink
                        to='/notification'
                        className={({ isActive }) =>
                            `py-4 px-8 cursor-pointer w-full relative ${isActive ? 'bg-primary text-white' : 'bg-base-100 hover:bg-base-300'}`
                        }
                    >
                        <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                            <Bell size={25} />
                            <span className='hidden md:block text-lg'>Notification</span>
                        </div>
                        {pendingRequests.length > 0 && (
                            <div className='bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs absolute top-2 right-6 z-30'>
                                {pendingRequests?.length}
                            </div>
                        )}
                    </NavLink>
                </div>
            </aside>
            <Outlet />
        </>
    );
};

export default Sidebar;
