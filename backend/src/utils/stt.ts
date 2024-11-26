import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { configureOpenAI } from "../config/openai.js"; 

const openaiConfig = configureOpenAI();

const openai = new OpenAI({
  apiKey: openaiConfig.apiKey,  // OpenAI API 키 설정
  organization: openaiConfig.organization,  // OpenAI 조직 ID 설정
});


export async function transcribeAudioToText(audioBuffer) {
  try {
    
    // 1. 임시 파일 생성
    const tempFilePath = path.join(process.cwd(), "temp_audio.mp3"); // 프로젝트 루트 디렉토리에 저장
    fs.writeFileSync(tempFilePath, audioBuffer);

    // 2. Whisper API 호출
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath), // 파일 스트림 전달
      model: "whisper-1",
    });

    // 3. 임시 파일 삭제
    fs.unlinkSync(tempFilePath);

    return transcription.text; // 변환된 텍스트 반환
  } catch (error) {
    console.error("Error in transcription:", error.message);
    throw new Error("Failed to process audio");
  }
}
