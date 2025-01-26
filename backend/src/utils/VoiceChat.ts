import { OpenAI } from "openai";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Node.js용 fetch
import FormData from "form-data"; // Node.js용 FormData
import { configureOpenAI, ModelName } from "../config/openai.js";
import ScenarioModel from "../models/Scenario.js";
dotenv.config();

const openaiConfig = configureOpenAI();
const openai = new OpenAI({
    apiKey: openaiConfig.apiKey,
    organization: openaiConfig.organization,
});

export async function transcribeAudioToText(audioBuffer: Buffer): Promise<string> {
    try {
        if (!audioBuffer) {
            throw new Error("No audio data provided");
        }
        // Buffer로 변환 (Node.js 환경)
        const buffer = Buffer.isBuffer(audioBuffer) ? audioBuffer : Buffer.from(audioBuffer);

        // FormData 생성
        const formData = new FormData();
        formData.append("file", buffer, { filename: "audio.wav", contentType: "audio/wav" });
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        // Whisper API 호출
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${openaiConfig.apiKey}`,
                ...formData.getHeaders(), // FormData 헤더 추가
            },
            body: formData, // FormData 전달
        });

        // 응답 확인
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Whisper API Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result.text; // 변환된 텍스트 반환
    } catch (error) {
        console.error("[ERROR] Error in transcription:", error.message);
        throw new Error("Failed to process audio");
    }
}

export async function generateSpeechFromText(text: string): Promise<Buffer> {
    try {
        // TTS API 호출
        const mp3 = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy", // 음성 선택
            input: text,
        });

        // MP3 데이터를 Buffer로 변환
        const buffer = Buffer.from(await mp3.arrayBuffer());
        return buffer; // Buffer 반환
    } catch (error) {
        console.error("Error generating speech:", error.message);
        throw new Error("Error converting text to speech");
    }
}

interface GenerateResponseOptions {
    scenarioId?: string | null;
    selectedRole?: string | null;
    difficulty?: number | null;
}

export async function generateFineTunedResponse(userText: string, options: GenerateResponseOptions = {}): Promise<{ text: string }> {
    const { scenarioId = null, selectedRole = null, difficulty = null } = options;

    try {
        if (!userText) {
            throw new Error("User text is missing");
        }

        let systemMessage;
        let fineTunedModel = ModelName; // 기본 모델 설정

        if (scenarioId) {
            const scenario = await ScenarioModel.findById(scenarioId);
            if (!scenario) {
                throw new Error(`Scenario with ID '${scenarioId}' not found.`);
            }

            const { name: scenarioName, fineTunedModel: scenarioModel, roles } = scenario;

            // 역할 검증
            if (selectedRole && !roles[selectedRole]) {
                throw new Error(`Invalid role '${selectedRole}'. Available roles: ${Object.keys(roles).join(", ")}.`);
            }

            // 반대 역할 가져오기
            const oppositeRoleKey = getOppositeRole(roles, selectedRole); // role1 -> role2 또는 반대
            const roleName = roles[oppositeRoleKey] || "guide";

            // 난이도 메시지 추가
            const difficultyMessage = difficulty
                ? `Please provide a response suitable for difficulty level ${difficulty} (1~3).`
                : "";

            // 시스템 메시지 생성
            systemMessage = `You are a ${roleName} in the ${scenarioName} scenario. ${difficultyMessage}`;
            fineTunedModel = scenarioModel || ModelName;
        } else {
            systemMessage =
                "You are an English-speaking friend helping the user improve their English skills. " +
                "Your role is to correct grammar mistakes, suggest better expressions, and answer questions in a friendly and supportive way. " +
                "Always explain in simple terms to make learning fun and engaging.";
        }

        // OpenAI GPT 모델 호출
        const completion = await openai.chat.completions.create({
            model: fineTunedModel,
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userText },
            ],
        });

        if (!completion || !completion.choices || !completion.choices[0]) {
            throw new Error("GPT response is empty");
        }

        const responseText = completion.choices[0].message.content.trim();
        return { text: responseText };
    } catch (error) {
        console.error("Error in generateFineTunedResponse:", error.message);
        throw new Error("Error generating response");
    }
}

// 반대 역할 계산 함수
const getOppositeRole = (roles, selectedRole) => {
    return Object.keys(roles).find((key) => key !== selectedRole) || "unknown role";
};