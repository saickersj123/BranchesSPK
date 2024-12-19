import mongoose from "mongoose";
import conversationSchema from "./Conversation.js";
import modelSchema from "./CustomModel.js"
import chatboxSchema from "./Chatbox.js"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    exp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    conversations: [conversationSchema],
    CustomModels: [modelSchema],
    ChatBox: [chatboxSchema],
});


// 레벨 설정
userSchema.methods.updateLevel = function() {
    const levels = [
        0, 100, 300, 600, 1000, 1500, 2100, 3000, 4000, 5000, 
        6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000
    ]; // Max level is 20
    let newLevel = 1;
    for (let i = 0; i < levels.length; i++) {
        if (this.exp >= levels[i]) {
            newLevel = i + 1;
        } else {
            break;
        }
    }
    if (newLevel !== this.level) {
        this.level = newLevel;
        return this.save();
    }
    return Promise.resolve(this);
};

export default mongoose.model("User", userSchema);
