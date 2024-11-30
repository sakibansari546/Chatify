import express from "express";

import { protectedRoute } from "../middlewares/auth.middleware.js";
import { upload } from '../middlewares/multer.js'

import { getMessages } from "../controllers/chat.contriller.js";

const router = express.Router();

router.get('/get-messages/:id', protectedRoute, getMessages)

export default router;