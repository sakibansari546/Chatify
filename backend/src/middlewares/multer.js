import multer from "multer";

// Storage setup (optional)
const storage = multer.memoryStorage(); // Use memory storage for Cloudinary uploads
export const upload = multer({ storage });