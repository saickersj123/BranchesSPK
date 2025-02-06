import express from "express";
import { getScenarioChatResponse, generateChatCompletion } from "../controllers/ChatController.js";

const router = express.Router();

// ✅ 새로운 엔드포인트: MongoDB 시나리오 기반 응답
router.post("/scenario", getScenarioChatResponse);

// ✅ 기존 엔드포인트: OpenAI 기반 응답
router.post("/chat", generateChatCompletion);

export default router;
