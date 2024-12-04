import express from "express";

import { protectedRoute } from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.js'

import { getMessages, sendMessage } from "../controllers/chat.controller.js";

const router = express.Router();

router.get('/get-messages/:id', protectedRoute, getMessages);

router.post("/send-message/:id", protectedRoute, upload.single("image"), sendMessage)


export default router;