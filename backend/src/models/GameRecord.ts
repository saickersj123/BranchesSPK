// backend/src/models/record.ts
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    date: { 
        type: Date, 
        default: Date.now, 
        required: true 
    },
    experience: { 
        type: Number, 
        required: true 
    },
    matched: { 
        type: Number, 
        required: true 
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
    scenarioId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Scenario', 
        required: true 
    }, 
    gameId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Game', 
        required: true 
    }, 
});

// 모델 생성
const Record = mongoose.model('Record', recordSchema);
export default Record;

