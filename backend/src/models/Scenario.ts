import mongoose from 'mongoose';
const ScenarioSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
        min: 1,
        max: 3, // 난이도는 1~3 범위로 제한
    },
    fineTunedModel: {
        type: String,
        default: null,
    },
}, {
    timestamps: true, // 자동으로 createdAt, updatedAt 생성
});
export default mongoose.model("Scenario", ScenarioSchema);
