import mongoose, { Schema } from "mongoose";

const GameSchema = new mongoose.Schema({
    game: {
         type: String, required: true
         }, // 게임 이름
    description: { 
        type: String
        },     // 게임 설명
});

export default mongoose.model("Game", GameSchema);
