import { Bell, Home, MessageCircle, Users } from 'lucide-react'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>
            <aside className='bg-base-100 w-full sm:w-[15%] md:w-[20%] lg:w-[15%] rounded-md sm:h-[80vh] fixed bottom-0 left-0 sm:left-4 md:left-6 lg:left-8 sm:top-24 sm:bottom-auto z-50'>
                <div className='flex flex-row sm:flex-col items-center justify-around sm:justify-start w-full'>
                    <Link to='/'>
                        <div className='bg-base-300 py-4 px-8 cursor-pointer w-full '>
                            <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                                <Home size={25} />
                                <span className='hidden md:block text-lg'>Home</span>
                            </div>
                        </div>
                    </Link>

                    <Link to='/chat'>
                        <div className='bg-base-100 hover:bg-base-300 py-4 px-8 cursor-pointer'>
                            <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                                <MessageCircle size={25} />
                                <span className='hidden md:block text-lg'>Message</span>
                            </div>
                        </div>
                    </Link>
                    <Link to='/someone/friends'>
                        <div className='bg-base-100 hover:bg-base-300 py-4 px-8 cursor-pointer'>
                            <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                                <Users size={25} />
                                <span className='hidden md:block text-lg'>Friends</span>
                            </div>
                        </div>
                    </Link>

                    <Link to={`/notification`} className='bg-base-100 hover:bg-base-300 py-4 px-8 cursor-pointer'>
                        <div className='flex items-center justify-center sm:justify-start gap-3 sm:pl-6 md:pl-8'>
                            <Bell size={25} />
                            <span className='hidden md:block text-lg'>Notification</span>
                        </div>
                    </Link>
                </div>
            </aside>
            <Outlet />
        </>
    )
}

export default Sidebar
