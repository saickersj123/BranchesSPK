import express from "express";
import multer from "multer";
import { transcribeAudioToText } from "../utils/stt.js"; // STT 유틸리티
import { generateFineTunedResponse } from "../utils/genRes.js"; // GPT 유틸리티

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // 메모리 스토리지 설정
});

// STT + GPT + TTS 통합 API
router.post("/process-audio", upload.single("audio"), async (req, res) => {
  try {
    // 1. 업로드된 음성 파일을 가져오기
    const audioBuffer = req.file.buffer;

    // 2. STT: 음성 -> 텍스트 변환
    const userText = await transcribeAudioToText(audioBuffer);

    // 3. GPT + TTS: 변환된 텍스트를 기반으로 응답 생성 및 음성 변환
    const gptResponse = await generateFineTunedResponse(userText);

    // 4. 텍스트 부분 응답
    res.setHeader("Content-Type", "application/json"); // 텍스트는 JSON 형식으로 반환
    res.write(JSON.stringify({
      text: gptResponse.text,  // GPT가 생성한 텍스트
    }) + "\n"); // 텍스트 응답 전송

    // 텍스트 응답 후, 음성 스트리밍 시작
    const audioStream = gptResponse.audio;

    // 5. 음성 파일을 스트리밍으로 전송
    audioStream.pipe(res);

    // 음성 스트리밍이 끝날 때 응답 종료
    audioStream.on('end', () => {
      res.end();  // 음성 스트리밍이 끝난 후 응답 종료
    });

  } catch (error) {
    console.error("Error processing audio:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
