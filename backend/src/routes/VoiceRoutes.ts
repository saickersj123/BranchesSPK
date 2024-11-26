import express from "express";
import { uploadVoiceFile, getAllVoiceFiles } from "../controllers/VoiceController.js";
import { verifyToken } from "../utils/Token.js";  // 필요한 경우 인증 미들웨어 추가

const voiceRoutes = express.Router();

// 음성 파일 업로드 라우트 (파일 업로드를 위해 verifyToken 미들웨어 추가 가능)
voiceRoutes.post("/chat/c/:conversationId/voice", verifyToken, uploadVoiceFile);

// 모든 음성 파일 목록을 가져오는 라우트
voiceRoutes.get("/files", verifyToken, getAllVoiceFiles);

export default voiceRoutes;