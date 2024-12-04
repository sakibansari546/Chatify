import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    },
    seenBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], // Jinhone message dekh liya
    typingStatus: {
        type: Map, // Har user ka typing status track karega
        of: Boolean, // true => typing; false => not typing
        default: {} // Default sabke liye false
    }

},
    {
        timestamps: true,
    }
);

export default mongoose.model("Message", messageSchema);

