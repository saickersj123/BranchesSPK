import mongoose, { Schema } from "mongoose";

const KeywordSchema = new mongoose.Schema({
        scenario: [
            {
                type: Schema.Types.ObjectId, // 참조를 위한 ObjectId 타입 설정
                ref: "Scenario", // 참조 모델 이름
                required: true,
            }
        ],
        keywords: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true, // (선택) 생성/수정 시간 자동 관리
});

export default mongoose.model("Keyword", KeywordSchema);

