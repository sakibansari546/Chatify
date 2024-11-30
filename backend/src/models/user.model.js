import mongoose from "mongoose";

let profile_imgs_name_list = ["Garfield", "Tinkerbell", "Annie", "Loki", "Cleo", "Angel", "Bob", "Mia", "Coco", "Gracie", "Bear", "Bella", "Abby", "Harley", "Cali", "Leo", "Luna", "Jack", "Felix", "Kiki"];
let profile_imgs_collections_list = ["notionists-neutral", "adventurer-neutral", "fun-emoji"];

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: () => {
            return `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}`;
        }
    },

    // Friend-related fields
    pendingRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], // Users who received requests
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], // Users who sent requests
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }] // List of confirmed friends
},
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);
