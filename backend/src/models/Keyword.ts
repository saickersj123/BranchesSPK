import mongoose, { Schema } from "mongoose";

const KeywordSchema = new mongoose.Schema({
        scenario: {
            type: Schema.Types.ObjectId, // ✅ 배열([]) 제거
            ref: "Scenario",
            required: true,
        },

        keywords: {
            type: [String],
            required: true,
        },
    },
    {
        timestamps: true, // (선택) 생성/수정 시간 자동 관리
});

export default mongoose.model("Keyword", KeywordSchema);

