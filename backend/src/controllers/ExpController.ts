import { Request, Response } from "express";
import User from "../models/User.js";
import Record from '../models/GameRecord.js';

// 경험치 추가
export const addUserExp = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const { exp, date, matched } = req.body;
        // 인증된 사용자 정보 가져오기
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        // 경험치 추가
        user.exp += exp;
        await user.save();

        // 경험치 기록 저장
        const newRecord = new Record({
            date: date || new Date(),
            experience: exp,
            matched,
            userId,
            scenarioId: null,
            gameId: null
        });
        await newRecord.save();

        // 결과 반환
        res.status(201).json({
            message: "EXP added successfully",
            exp: user.exp,
            record: newRecord
        });

    } catch (error) {
        console.error("Failed to add EXP:", error.message);
        res.status(500).send("Server error");
    }
};

// 경험치 감소
export const deleteUserExp = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const { exp, date, matched } = req.body;
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        // 경험치 감소 (0 이하로는 줄지 않도록 보호)
        const newExp = Math.max(user.exp - exp, 0);
        user.exp = newExp;
        await user.save();

        // 경험치 기록 저장
        const newRecord = new Record({
            date: date || new Date(),
            experience: -exp,
            matched,
            userId,
            scenarioId: null,
            gameId: null
        });
        await newRecord.save();

        res.status(201).json({
            message: "EXP decreased successfully",
            exp: user.exp,
            record: newRecord
        });

    } catch (error) {
        console.error("Failed to decrease EXP:", error.message);
        res.status(500).send("Server error");
    }
};

// 경험치 조회
export const seeUserExp = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        // 경험치 반환
        res.status(200).json({
            message: "EXP retrieved successfully",
            exp: user.exp
        });

    } catch (error) {
        console.error("Failed to retrieve EXP:", error.message);
        res.status(500).send("Server error");
    }
};

