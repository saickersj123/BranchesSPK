import { OpenAI } from "openai";
import { PassThrough } from "stream";
import { configureOpenAI } from "../config/openai.js"; 

const openaiConfig = configureOpenAI();
const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,  // OpenAI API 키 설정
  organization: openaiConfig.organization,  // OpenAI 조직 ID 설정
});

export async function generateSpeechFromText(text) {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // 음성 선택
      input: text,
    });

    console.log(mp3); 
    
    // MP3 데이터를 메모리에서 스트림으로 변환
    const buffer = Buffer.from(await mp3.arrayBuffer());
    const stream = new PassThrough();
    stream.end(buffer);

    return stream; // 스트림 반환
  } catch (error) {
    console.error("Error generating speech:", error);
    throw new Error("Error converting text to speech");
  }
}
