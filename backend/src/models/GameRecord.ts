// backend/src/models/record.ts
import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    experience: { type: Number, required: true },
    keywordsMatched: { type: Number, required: true },
});

const Record = mongoose.model('Record', recordSchema);
export default Record;