import Message from "../models/chet.model.js"
import User from "../models/user.model.js"

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.body;
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
        }).sort({ updatedAt: -1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, messages: "Internal Server error!", error: error.message });
    }
};
export const sendMessage = async (req, res) => {
    try {
        const { id: userToChatId, message } = req.body;
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

        // Create and save message
        const newMessage = await Message.create({
            participants: [myId, userToChatId],
            sender: myId,
            content: message,
        });

        res.status(200).json({ success: true, newMessage });
    } catch (error) {
        res.status(500).json({ success: false, messages: "Internal Server error!", error: error.message });
    }
};
