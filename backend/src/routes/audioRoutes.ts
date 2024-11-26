import express from 'express';
import multer from 'multer';
import { uploadAudio, getAudio, handleVoiceMessage } from '../controllers/AudioController';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 오디오 업로드 및 가져오기 엔드포인트
router.post('/upload-audio', upload.single('audio'), uploadAudio);
router.get('/get-audio/:id', getAudio);

// 음성 메시지 처리 엔드포인트
router.post('/chat/c/:conversationId/voice', upload.single('audio'), handleVoiceMessage);

export default router;
