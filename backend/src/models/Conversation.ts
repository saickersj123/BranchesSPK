import mongoose from "mongoose";
import chatSchema from "./Chat.js";
import { randomUUID } from "crypto";

const scenarioSchema = new mongoose.Schema({
    scenarioId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Scenario", // Scenario 모델 참조
        required: function() { return this.type === 'scenario'; } // 🔹 scenario 타입일 때만 필수
    },
    selectedRole: {
        type: String,
        required: function() { return this.type === 'scenario'; }
    },
    difficulty: {
        type: Number,
        required: function() { return this.type === 'scenario'; }
    },
    gameId: {
        type: String,
        ref: "Game",
        default: null, // 기본 게임 ID (없으면 null)
    },
    // ✅ 시나리오 대화 종료 플래그 추가
    isEnded: {
        type: Boolean,
        default: false, // 기본값: false (대화 진행 중)
    }
});

const conversationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: randomUUID(),
    },
    type: {
        type: String,
        default: undefined,
        enum: ['voice', 'scenario'],
    },

    scenarioData: {
        type: scenarioSchema,
        default: null,
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
    { timestamps: true },
);
export default conversationSchema;