import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        } // Chat ke participants
    ],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }, // Message kisne bheja
            content: {
                type: String,
                required: true
            }, // Message ka content
            timestamp: {
                type: Date,
                default: Date.now
            }, // Message ka time
            seenBy: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                } // Jinhone message dekh liya
            ],
        }
    ],
    typingStatus: {
        type: Map, // Har user ka typing status track karega
        of: Boolean, // true => typing; false => not typing
        default: {} // Default sabke liye false
    }
});

export default mongoose.model("Chat", chatSchema);
