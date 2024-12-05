import express from "express";
import { transcribeAudioToText } from "../utils/stt.js"; // STT 유틸리티
import { generateFineTunedResponse } from "../utils/genRes.js"; // GPT 유틸리티
import scenarios from "../scenarios/index.js"; // 시나리오 모듈 가져오기

const router = express.Router();


router.post("/general", async (req, res) => {
    try {
        const { s3Url } = req.body; // 프론트에서 전달된 S3 URL
        if (!s3Url) {
            return res.status(400).json({ error: "S3 URL이 필요합니다." });
        }

        console.log("Received S3 URL:", s3Url);

        // 1. STT: S3 URL을 기반으로 음성 -> 텍스트 변환
        const userText = await transcribeAudioToText(s3Url);
        console.log("STT Result:", userText);

        // 2. GPT 응답 생성
        const gptResponse = await generateFineTunedResponse(userText);
        console.log("GPT Response:", gptResponse.text);

        // 3. 텍스트 응답 반환
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({
            text: gptResponse.text, // GPT 응답 텍스트
        }) + "\n");

        // 4. TTS 음성 스트리밍
        const audioStream = gptResponse.audio;

        // MIME 타입 설정 (TTS 데이터 타입에 따라 설정)
        res.setHeader("Content-Type", "audio/mpeg")
        audioStream.pipe(res);

        audioStream.on("end", () => {
            res.end(); // 스트리밍 종료
        });
    } catch (error) {
        console.error("Error processing audio:", error);
        res.status(500).json({ error: error.message });
    }
});

// STT + GPT + TTS 통합 API (S3 URL 기반 처리) - 시나리오
router.post("/scenarios", async (req, res) => {
    try {
        const { s3Url, scenarioKey } = req.body; // 프론트에서 S3 URL과 시나리오 키 전달
        if (!s3Url || !scenarioKey) {
            return res.status(400).json({ error: "S3 URL과 시나리오 키가 필요합니다." });
        }


        console.log("Received S3 URL:", s3Url);
        console.log("Received Scenario Key:", scenarioKey);

         // 시나리오 프롬프트 가져오기
         const scenario = scenarios[scenarioKey];
         if (!scenario) {
             return res.status(400).json({ error: "유효하지 않은 시나리오 키입니다." });
         }

        // 1. STT: S3 URL을 기반으로 음성 -> 텍스트 변환
        const userText = await transcribeAudioToText(s3Url);
        console.log("STT Result:", userText);

        // 2. GPT 응답 생성
        const gptResponse = await generateFineTunedResponse(userText, scenarios.prompt);
        console.log("GPT Response:", gptResponse.text);

        // 3. 텍스트 응답 반환
        res.setHeader("Content-Type", "application/json");
        res.write(JSON.stringify({
            text: gptResponse.text, // GPT 응답 텍스트
        }) + "\n");

        // 4. TTS 음성 스트리밍
        const audioStream = gptResponse.audio;

        // MIME 타입 설정 (TTS 데이터 타입에 따라 설정)
        res.setHeader("Content-Type", "audio/mpeg")
        audioStream.pipe(res);

        audioStream.on("end", () => {
            res.end(); // 스트리밍 종료
        });
    } catch (error) {
        console.error("Error processing audio:", error);
        res.status(500).json({ error: error.message });
    }
});


    

export default router;
