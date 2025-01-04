import mongoose, { Schema } from "mongoose";

const KeywordSchema = new mongoose.Schema(
    {
        scenarioName: { 
            type: String,
            required: true 
        },
        keywords: {
            type: [String],
            required: true
        },
    }
);

export default mongoose.model("Keyword", KeywordSchema);
