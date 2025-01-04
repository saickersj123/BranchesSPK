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
        0, 60, 140, 250, 400, 600, 860, 1200, 1630, 2170, 
        2840, 3700, 4700, 5800, 7200, 8800, 10700, 13000, 16000, 20000
    ]; // 최대 20
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