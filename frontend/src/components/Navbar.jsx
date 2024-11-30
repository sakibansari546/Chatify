import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import { LogOut, MessageSquare, Settings, User } from 'lucide-react'
import { logout } from '../store/actions/userActions'


const Navbar = () => {
    const dispatch = useDispatch();
    const { authUser } = useSelector((state) => state.user);
    return (
        <>
            <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80 mb-[65px]">
                <div className="container mx-auto px-4 h-16">
                    <div className="flex items-center justify-between h-full">
                        <div className="flex items-center gap-8">
                            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                </div>
                                <h1 className="text-lg font-bold">Chatify</h1>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                to={"/settings"}
                                className={`btn btn-sm gap-2 transition-colors`}
                            >
                                <Settings className="w-4 h-4" />
                                <span className="hidden sm:inline">Settings</span>
                            </Link>


                            <>
                                <Link to={`/profile/${authUser?.username}`} className={`btn btn-sm gap-2`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">{authUser?.username}</span>
                                </Link>

                                <button
                                    onClick={() => dispatch(logout())}
                                    className="flex gap-2 items-center" >
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>

                        </div>
                    </div>
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default Navbar