import mongoose from "mongoose";
import chatSchema from "./Chat.js";
import { randomUUID } from "crypto";

const conversationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    type:{
        type: String,
        default: undefined,
        enum: ['voice', 'scenario'],
    },
    chats: [chatSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
},
{timestamps: true},
);

export default conversationSchema;
