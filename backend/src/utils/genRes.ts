import { generateSpeechFromText } from "./tts.js"; // TTS 유틸리티 가져오기
import { OpenAI } from "openai";
import { configureOpenAI, ModelName } from "../config/openai.js"; 
import dotenv from "dotenv";

dotenv.config(); // 환경 변수 로드

const openaiConfig = configureOpenAI();

const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,  // OpenAI API 키 설정
  organization: openaiConfig.organization,  // OpenAI 조직 ID 설정
});

const fineTunedModel = process.env.FINE_TUNED_MODEL || ModelName;

export async function generateFineTunedResponse(userText) {
  try {

    const systemMessage =
      "You are an English learning assistant. Your job is to help the user improve their English skills by providing explanations, correcting grammar, and answering questions about English language learning.";

    // GPT 모델 호출
    const completion = await openai.chat.completions.create({
      model: fineTunedModel,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userText },
      ],
    });


    const responseText = completion.choices[0]?.message?.content || "";

    if (!responseText.trim()) {
      throw new Error("GPT response is empty!");
    }

    // TTS 호출
    const audioStream = await generateSpeechFromText(responseText);

    return { text: responseText, audio: audioStream };
  } catch (error) {
    console.error("Error generating response:", error.message);
    throw new Error("Error generating response");
  }
}
