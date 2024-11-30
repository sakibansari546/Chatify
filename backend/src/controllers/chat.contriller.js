import Message from "../models/chat.model.js"
import User from "../models/user.model.js"
import { getReceiverSocketId, io } from '../lib/socket.js';
import cloudinary from '../lib/cloudinary.js'

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.userId;

        // Fetch both users
        const [userToChat, myUser] = await Promise.all([
            User.findById(userToChatId),
            User.findById(myId)
        ]);

        // Validate if users exist and are friends
        if (!userToChat || !myUser) {
            return res.status(404).json({ error: "One or both users not found" });
        }
        if (!myUser.friends.includes(userToChatId) || !userToChat.friends.includes(myId)) {
            return res.status(400).json({ error: "You are not friends with this user" });
        }

        // Get messages
        const messages = await Message.find({
            participants: { $all: [myId, userToChatId] }
        })

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, messages: "Internal Server error!", error: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const { id: userToChatId } = req.params;
        const myId = req.userId;
        const image = req.file;

        if (!image && !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Fetch both users
        const [userToChat, myUser] = await Promise.all([
            User.findById(userToChatId),
            User.findById(myId)
        ]);

        // Validate if users exist and are friends
        if (!userToChat || !myUser) {
            return res.status(404).json({ error: "One or both users not found" });
        }
        if (!myUser.friends.includes(userToChatId) || !userToChat.friends.includes(myId)) {
            return res.status(400).json({ error: "You are not friends with this user" });
        }

        let imageUrl = null;
        if (image) {
            const uploadStream = async (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "chatApp/messages" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(buffer);
                });
            };

            const cloudRes = await uploadStream(image.buffer);
            imageUrl = cloudRes.secure_url;
        }

        // Create and save message
        const newMessage = await Message.create({
            participants: [myId, userToChatId],
            sender: myId,
            content: message,
            image: imageUrl,
        });

        res.status(200).json({ success: true, newMessage });

        // Real-time update using Socket.IO
        // Real-time update using Socket.IO
        const receiverSocketId = await getReceiverSocketId(userToChatId); // Ensure this function is implemented correctly
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", { chatId: userToChatId, message: newMessage });
        }

    } catch (error) {
        res.status(500).json({ success: false, messages: "Internal Server error!", error: error.message });
    }
};
