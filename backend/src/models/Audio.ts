import mongoose, { Schema, Document } from 'mongoose';

interface IAudio extends Document {
  userId: string;
  conversationId: string;
  audioData: Buffer; // 오디오 데이터를 저장하는 필드
  createdAt: Date;
}

const AudioSchema: Schema = new Schema({
  userId: { type: String, required: true },
  conversationId: { type: String, required: true },
  audioData: { type: Buffer, required: true }, // Binary 데이터로 저장
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAudio>('Audio', AudioSchema);
