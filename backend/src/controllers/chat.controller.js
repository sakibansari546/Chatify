import cloudinary from "../lib/cloudinary.js";
import Message from "../models/chet.model.js"
import User from "../models/user.model.js"


export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.userId;

        if (!userToChatId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Check if user exists
        const user = await User.findById(userToChatId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.friends.includes(myId)) {
            return res.status(400).json({ success: false, message: "You are not friends with this user" });
        }

        const messages = await Message.find({
            $or: [
                { senderId: myId, reciverId: userToChatId },
                { senderId: userToChatId, reciverId: myId }
            ]
        });

        res.status(200).json({ success: true, messages })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id: reciverId } = req.params;
        const senderId = req.userId;
        const { text } = req.body;
        const image = req.file;


        if (!text && !image) {
            return res.status(400).json({ success: false, message: "Text is required" });
        } else if (text.length > 1000) {
            return res.status(400).json({ success: false, message: "Text is too long" });
        }

        if (!reciverId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Check if user exists
        const user = await User.findById(reciverId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        if (!user.friends.includes(senderId)) {
            return res.status(400).json({ success: false, message: "You are not friends with this user" });
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

        const newMessage = new Message({
            senderId,
            reciverId,
            text,
            image: imageUrl
        });

        if (newMessage) {
            await newMessage.save();
            res.status(201).json({ success: true, message: newMessage });
        } else {
            res.status(400).json({ success: false, message: "Invalid message data" });
        }

        
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}