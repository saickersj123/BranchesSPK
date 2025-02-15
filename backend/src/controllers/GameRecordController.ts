import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Record from '../models/GameRecord.js';


// 🗂️ 1️⃣ **모든 기록 조회 (현재 사용자 전용)**
export const getRecords = async (
    req: Request, 
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        const records = await Record.find({ userId }).sort({ date: -1 });
        res.status(200).json(records);
    } catch (error) {
        console.error("❌ [ERROR] getRecords:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 🆕 2️⃣ **게임 기록 추가**
export const addRecord = async (
    req: Request, 
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        const { date, experience, matched, scenarioId, gameId } = req.body;
        const newRecord = new Record({
            date: date || new Date(),
            experience,
            matched,
            userId,
            scenarioId: scenarioId || null,
            gameId: gameId || null
        });

        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        console.error("❌ [ERROR] addRecord:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};

// 🔍 3️⃣ **특정 기록 조회**
export const getRecordById = async (
    req: Request, 
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        const { id } = req.params;
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }
        res.status(200).json(record);
    } catch (error) {
        console.error("❌ [ERROR] getRecordById:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};

// ⚠️ 4️⃣ **모든 기록 삭제**
export const deleteAllRecords = async (
    req: Request,
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        await Record.deleteMany({ userId });
        res.status(204).send();
    } catch (error) {
        console.error("❌ [ERROR] deleteAllRecords:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};

// ✏️ 5️⃣ **특정 기록 업데이트**
export const updateRecord = async (
    req: Request, 
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        const { id } = req.params;
        const { date, experience, matched } = req.body;

        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            { date, experience, matched },
            { new: true, runValidators: true }
        );

        if (!updatedRecord) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }

        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error("❌ [ERROR] updateRecord:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};

// ❌ 6️⃣ **특정 기록 삭제**
export const deleteRecordById = async (
    req: Request, 
    res: Response
) => {
    try {
        const userId = res.locals?.jwtData?.id;
        if (!userId) {
            return res.status(403).json({ message: "🚨 사용자 인증 정보가 없습니다." });
        }

        const { id } = req.params;
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error("❌ [ERROR] deleteRecordById:", error.message);
        res.status(500).json({ message: '서버 오류' });
    }
};
