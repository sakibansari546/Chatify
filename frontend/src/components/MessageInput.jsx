import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react'
import { Image, Loader2, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { handleTypingStatus, sendNewMessage } from '../store/actions/chatActions';

const MessageInput = ({ selectedFriend }) => {
    const dispatch = useDispatch();

    const { socket, authUser } = useSelector(state => state.user);

    const fileInputRef = useRef(null);
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false)

    const handleImageChange = () => {
        const file = fileInputRef.current.files[0];
        // if (!file.type.startWith("image/")) return toast.error("Please select an image file :)");
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const removeImage = () => {
        setImagePreview(null);
        fileInputRef.current.value = null;
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) retrun

        try {
            const formData = new FormData();
            formData.append("text", text);
            if (fileInputRef.current.files[0]) {
                formData.append("image", fileInputRef.current.files[0]);
            }

            setLoading(true);
            await dispatch(sendNewMessage(selectedFriend?._id, formData))
            setLoading(false);
            // clear form values
            setText("");
            setImagePreview(null);
            fileInputRef.current.value = null;

            if (socket) {
                socket.emit("typing", {
                    senderId: authUser._id,
                    receiverId: selectedFriend?._id,
                    isTyping: false,
                });


            }

        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const handleTyping = (e) => {
        setText(e.target.value);
        if (socket) {
            socket.emit("typing", {
                senderId: authUser._id,
                receiverId: selectedFriend?._id,
                isTyping: e.target.value.length > 0,
            });

            setTimeout(() => {
                socket.emit("typing", {
                    senderId: authUser._id,
                    receiverId: selectedFriend?._id,
                    isTyping: false,
                });
            }, 2000);

            clearTimeout();
        }
    };




    return (
        <div className="p-4 w-full fixed -bottom-4">
            {imagePreview && (
                <div className="mb- flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                            onClick={removeImage}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
                            type="button"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-center gap-2 bg-base-100 py-2'>
                <div className='flex-1 flex gap-2'>
                    <input
                        type="text"
                        className='input input-bordered w-full input-sm sm:input-md'
                        placeholder='Type a message...'
                        value={text}
                        onChange={handleTyping}
                        disabled={loading}
                    />
                    <input
                        type="file"
                        accept='image/*'
                        className='hidden'
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className={`flex btn btn-sm btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <Image size={20} />
                    </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={(!text.trim() && !imagePreview) || loading}
                >
                    {loading ? (
                        <Loader2 className='size-5 animate-spin' />
                    ) : (
                        <Send size={20} />
                    )}
                </button>
            </form>

        </div>
    )
}

export default MessageInput