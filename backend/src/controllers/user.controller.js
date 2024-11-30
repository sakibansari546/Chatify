import bcrypt from 'bcrypt'

import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js'

// Models
import User from '../models/user.model.js'
import { getReceiverSocketId, io } from '../lib/socket.js';

export const signup = async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;

        if (!username || username.length < 3) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }
        if (!fullName || fullName.length < 5) {
            return res.status(400).json({ success: false, message: "Full name is required and must be at least 5 characters long" });
        }
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password is required and must be at least 6 characters long" });
        }

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Check if username already exists
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ success: false, message: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            fullName,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        generateToken(newUser._id, res);

        // Convert user to plain object and exclude password
        const userData = newUser.toObject();
        delete userData.password;

        res.status(201).json({ success: true, message: "User created successfully", user: userData });
    } catch (error) {
        // Handle duplicate key errors (e.g., unique indexes in MongoDB)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ success: false, message: `${field} already exists` });
        }
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "email and password are required" });
        }

        const user = await User.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        generateToken(user._id, res);

        // Convert user to plain object and exclude password
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ success: true, message: "Login successful", user: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User found", user: user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullName, username } = req.body;
        const profilePic = req.file;

        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const existUsername = await User.findOne({ username });
        if (existUsername) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }

        if (fullName) {
            user.fullName = fullName;
        }

        if (username) {
            user.username = username;
        }

        if (profilePic) {
            const uploadStream = async (buffer) => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "chatApp/users" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(buffer);
                });
            };

            const cloudRes = await uploadStream(profilePic.buffer);
            user.profilePic = cloudRes.secure_url;
        }

        await user.save();

        // Convert user to plain object and exclude password
        const userData = user.toObject();
        delete userData.password;

        res.status(200).json({ success: true, message: "Profile updated successfully", user: userData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
}

export const getRecomendedUsers = async (req, res) => {
    try {
        const userId = req.userId; // Assuming logged-in user ID is in req.user
        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Exclude current user's friends, pending requests, and the user themself
        const excludedUsers = [
            ...currentUser.friends,
            ...currentUser.pendingRequests,
            userId
        ];

        // Find 5 recommended users
        const recommendedUsers = await User.find({
            _id: { $nin: excludedUsers },
        }).limit(5).select("username fullName profilePic"); // Select specific fields to return

        res.status(200).json({
            success: true,
            users: recommendedUsers,
        });
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, message: "Search query is required" });
        }

        const users = await User.find({
            _id: { $ne: req.userId }, // Exclude the current user
            $or: [
                { username: { $regex: query, $options: "i" } },
                { fullName: { $regex: query, $options: "i" } },
            ],
        }).select("username fullName profilePic");

        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getFriends = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("friends", "username fullName profilePic");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, friends: user.friends });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const getPendingRequests = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("pendingRequests", "_id username fullName profilePic");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, pendingRequests: user.pendingRequests });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // User A (receiver)
        const senderId = req.userId; // User B (sender)

        if (userId === senderId) {
            return res.status(400).json({ success: false, message: "You can't send a friend request to yourself" });
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(userId);

        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (receiver.pendingRequests.includes(senderId)) {
            return res.status(400).json({ success: false, message: "Friend request already sent" });
        }

        if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ success: false, message: "User is already your friend" });
        }

        // Update requests
        receiver.pendingRequests.push(senderId);
        sender.sentRequests.push(userId);

        await receiver.save();
        await sender.save();

        // Populate the updated `pendingRequests` with necessary fields
        const updatedReceiver = await User.findById(userId)
            .populate('pendingRequests', 'username fullname profilePic'); // Fields you need

        res.status(200).json({
            success: true,
            message: "Friend request sent successfully",
            pendingRequests: updatedReceiver.pendingRequests, // Populated pendingRequests
            sentRequests: sender.sentRequests, // Sender's sent requests
        });

        const receiverSocketId = getReceiverSocketId(receiver._id);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newFriendRequest", {
                pendingRequests: updatedReceiver.pendingRequests,
            });
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // Sender ID (person who sent the request)
        const receiverId = req.userId; // Receiver ID (logged-in user)

        // Fetch users
        const sender = await User.findById(userId);
        const receiver = await User.findById(receiverId);

        // Check if both users exist
        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if the request exists
        if (!receiver.pendingRequests.includes(userId)) {
            return res.status(400).json({ success: false, message: "No friend request found" });
        }

        // Check if they are already friends
        if (receiver.friends.includes(userId)) {
            // Remove stale request
            receiver.pendingRequests = receiver.pendingRequests.filter((id) => id.toString() !== userId);
            sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== receiverId);

            await sender.save();
            await receiver.save();

            return res.status(400).json({ success: false, message: "User is already your friend" });
        }

        // Update friends list
        receiver.friends.push(userId);
        sender.friends.push(receiverId);

        // Remove pending and sent requests
        receiver.pendingRequests = receiver.pendingRequests.filter((id) => id.toString() !== userId);
        sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== receiverId);

        // Save updated user data
        await sender.save();
        await receiver.save();

        // Fetch updated receiver data with populated pendingRequests
        const updatedReceiver = await User.findById(receiverId)
            .populate("pendingRequests", "username fullname profilePic"); // Adjust fields as needed

        // Send response
        res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
            friends: updatedReceiver.friends, // Updated friends list
            pendingRequests: updatedReceiver.pendingRequests, // Updated pending requests
        });

        // Real-time update using Socket.IO
        const receiverSocketId = getReceiverSocketId(sender._id); // Function to get socket ID of receiver
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("requestAccepted", {
                friends: updatedReceiver.friends,
                pendingRequests: updatedReceiver.pendingRequests,
                userName: receiver.username, // Optional: For better UI updates
            });
        }
    } catch (error) {
        console.error("Error in acceptFriendRequest:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const rejectFriendRequest = async (req, res) => {
    try {
        const { userId } = req.params; // Sender ID (person who sent the request)
        const receiverId = req.userId; // Receiver ID (logged-in user)

        // Fetch sender and receiver
        const sender = await User.findById(userId);
        const receiver = await User.findById(receiverId);

        // Validate users
        if (!sender || !receiver) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if a friend request exists
        const isPendingRequest = receiver.pendingRequests.includes(userId);
        const isSentRequest = sender.sentRequests.includes(receiverId);

        if (!isPendingRequest || !isSentRequest) {
            return res.status(400).json({ success: false, message: "No friend request found" });
        }

        // Check if they are already friends (unlikely, but safe to check)
        if (receiver.friends.includes(userId)) {
            // Cleanup stale request if it exists
            receiver.pendingRequests = receiver.pendingRequests.filter((id) => id.toString() !== userId);
            sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== receiverId);

            await sender.save();
            await receiver.save();

            return res.status(400).json({ success: false, message: "User is already your friend" });
        }

        // Remove the friend request from both users
        receiver.pendingRequests = receiver.pendingRequests.filter((id) => id.toString() !== userId);
        sender.sentRequests = sender.sentRequests.filter((id) => id.toString() !== receiverId);

        // Save changes
        await sender.save();
        await receiver.save();

        // Populate updated pending requests
        const updatedReceiver = await User.findById(receiverId)
            .populate("pendingRequests", "username fullname profilePic");

        // Respond with success
        res.status(200).json({
            success: true,
            message: "Friend request rejected successfully",
            pendingRequests: updatedReceiver.pendingRequests, // Updated pending requests
        });
    } catch (error) {
        console.error("Error in rejectFriendRequest:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
