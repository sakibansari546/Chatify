import express from "express";
import { acceptFriendRequest, checkAuth, getFriends, getPendingRequests, getRecomendedUsers, login, logout, rejectFriendRequest, searchUsers, sendFriendRequest, signup, updateProfile } from "../controllers/user.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.js'

const router = express.Router();

// Authentication
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);

router.get('/check-auth', protectedRoute, checkAuth);

// Users 
router.put("/update-profile", protectedRoute, upload.single('profilePic'), updateProfile);

router.get('/recommended-users', protectedRoute, getRecomendedUsers);
router.get('/search', protectedRoute, searchUsers);
router.get('/get-friends', protectedRoute, getFriends);
router.get('/get-pending-requests', protectedRoute, getPendingRequests);

router.get('/send-friend-request/:userId', protectedRoute, sendFriendRequest);
router.get('/accept-friend-request/:userId', protectedRoute, acceptFriendRequest);
router.get('/reject-friend-request/:userId', protectedRoute, rejectFriendRequest);


export default router;