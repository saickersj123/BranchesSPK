import express from "express";
import { uploadVoiceFile } from "../controllers/VoiceController.js";
import { verifyToken } from "../utils/Token.js";

const voiceRoutes = express.Router();

// 음성 파일 업로드 라우트 (클라이언트 경로에 맞춰 수정됨)
voiceRoutes.post("/chat/c/:conversationId/voice", verifyToken, uploadVoiceFile);

export default voiceRoutes;
