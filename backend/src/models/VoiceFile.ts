import mongoose, { Document, Schema } from 'mongoose';

export interface VoiceFileDocument extends Document {
  filename: string;
  contentType: string;
  path: string;        // 파일 경로를 저장
  size: number;        // 파일 크기
  uploadDate: Date;
}

const voiceFileSchema = new Schema<VoiceFileDocument>({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  path: { type: String, required: true },       // 파일 경로 필드
  size: { type: Number, required: true },       // 파일 크기 필드
  uploadDate: { type: Date, required: true }
});

export default mongoose.model<VoiceFileDocument>('VoiceFile', voiceFileSchema);
