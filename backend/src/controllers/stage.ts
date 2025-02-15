import express, { Request, Response } from 'express';
import Stage from '../models/StageSchema.js';
import User from '../models/User.js';


const router = express.Router();

// 스테이지 등록 API
router.post('/register', async (req: Request, res: Response) => {
    const { name, keywords, modelInfo, userId } = req.body;

    const newStage = new Stage({
        name,
        keywords,
        modelInfo,
        userId
    });

    try {
        const savedStage = await newStage.save();
        res.status(201).json(savedStage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

// 키워드 평가 API
router.post('/evaluate', async (req: Request, res: Response): Promise<void> => {
    const { stageId, inputKeywords, userId } = req.body;

    try {
        const stage = await Stage.findById(stageId);
        if (!stage) {
            res.status(404).json({ message: 'Stage not found' });
            return;
        }
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "유저를 찾을 수 없습니다." });
            return;
        }

        const matchedKeywords = stage.keywords.filter(keyword => inputKeywords.includes(keyword));
        const evaluationScore = (matchedKeywords.length / stage.keywords.length) * 100; // 평가 점수 계산

        res.json({
            matchedKeywords,
            evaluationScore
        });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
});

export default router; 