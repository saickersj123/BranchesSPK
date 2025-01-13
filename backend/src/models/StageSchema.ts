import mongoose, { Document, Schema } from 'mongoose';

interface IStage extends Document {
    name: string;
    keywords: string[];
    modelInfo: string; // 모델 정보 추가
    userId: string; // 사용자 ID 추가
}

const stageSchema: Schema = new Schema({
    name: { type: String, required: true },
    keywords: [{ type: String }],
    modelInfo: { type: String, required: true }, // 모델 정보 필드
    userId: { type: String, required: true } // 사용자 ID 필드
});

// 스키마를 모델로 변환
const Stage = mongoose.model<IStage>('Stage', stageSchema);

export default Stage; 