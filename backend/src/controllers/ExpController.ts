import { Request, Response } from "express";
import User from "../models/User.js"; // 사용자 모델
import Record from '../models/GameRecord.js';

// 경험치 추가
export const addUserExp = async (
    req: Request, 
    res: Response
) => {
    try {
        const { exp, date, matched } = req.body;
        // 인증된 사용자 정보 가져오기
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "유저를 찾을 수 없습니다." });
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
        return res.status(201).json({
            message: "경험치 추가 성공",
            exp: user.exp,
            record: newRecord
        });

    } catch (error) {
        console.error("사용자의 경험치를 추가할 수 없습니다:", error.message);
        res.status(500).send("서버 에러");
    }
};

// 경험치 감소
export const deleteUserExp = async (
    req: Request, 
    res: Response
) => {
    try {
        const { exp, date, matched } = req.body;
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "유저를 찾을 수 없습니다." });
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

        return res.status(201).json({
            message: "경험치 감소 성공",
            exp: user.exp,
            record: newRecord
        });

    } catch (error) {
        console.error("사용자의 경험치를 감소할 수 없습니다:", error.message);
        res.status(500).send("서버 에러");
    }
};

// 경험치 조회
export const seeUserExp = async (
    req: Request, 
    res: Response
) => {
    try {
        const { id: userId } = res.locals.jwtData;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "유저를 찾을 수 없습니다." });
        }

        // 경험치 반환
        return res.status(200).json({
            message: "경험치 조회 성공",
            exp: user.exp
        });

    } catch (error) {
        console.error("사용자의 경험치를 조회할 수 없습니다:", error.message);
        res.status(500).send("서버 에러");
    }
};

