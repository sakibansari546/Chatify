import { useEffect, useState } from 'react'

import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Loader } from 'lucide-react';

import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Chat from './pages/Chat';
import ChatContainer from './pages/ChatContainer';
import Friends from './pages/Friends';
import Notification from './components/Notification';

import { acceptRealtimeRequest, checkAuth, connectSocket, fetchFriends, fetchPendingRequests, sendRealtimeRequest } from './store/actions/userActions';
import { handleTypingStatus, sendRealtimeMessage } from './store/actions/chatActions';

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector(state => state.theme);
  const { isCheckingAuth, authUser } = useSelector(state => state.user);


  useEffect(() => {
    dispatch(checkAuth());
  }, [checkAuth])

  useEffect(() => {
    const callDispatchs = async () => {
      await dispatch(checkAuth());
      // if (authUser) {
      await dispatch(fetchFriends());
      await dispatch(fetchPendingRequests());
      await dispatch(connectSocket());
      await dispatch(sendRealtimeRequest());
      await dispatch(acceptRealtimeRequest());
      await dispatch(sendRealtimeMessage());
      await dispatch(handleTypingStatus())

      // }
    }
    callDispatchs();
  }, [checkAuth, fetchFriends, fetchPendingRequests, connectSocket, sendRealtimeRequest, acceptRealtimeRequest, sendRealtimeMessage]);

  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center w-full h-screen'>
      <Loader className='size-10 animate-spin' />
    </div>
  )

  return (
    <div className='bg-base-200' data-theme={theme}>
      <div className="hidden md:block w-full h-screen text-5xl flex items-center justify-center"><h1>This is only visible on monbile screen....</h1></div>
      <div className="block md:hidden">
      <Routes>
        <Route path='/' element={<Navbar />} >
          <Route path='signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
          <Route path='login' element={!authUser ? <Login /> : <Navigate to='/' />} />
          <Route path='settings' element={<Setting />} />
          <Route path='profile/:username' element={authUser ? <Profile /> : <Navigate to='/login' />} />

          <Route path='/' element={authUser ? <Sidebar /> : <Navigate to='/login' />} >
            <Route index element={authUser ? <Home /> : <Navigate to='/login' />} />
            <Route path='chat' element={authUser ? <Chat /> : <Navigate to='/login' />} />
            <Route path=':username/friends' element={authUser ? <Friends /> : <Navigate to='/login' />} />
            <Route path='/notification' element={authUser ? <Notification /> : <Navigate to='/login' />} />
          </Route>

        </Route>
        <Route path='chat/:username' element={authUser ? <ChatContainer /> : <Navigate to='/login' />} />

      </Routes>
      <Toaster />
    </div >
      </div>
  )
}

export default App;
