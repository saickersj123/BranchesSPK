import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Keyword from "../models/Keyword.js";
import Game from "../models/Game.js";

// Return gamelist
export const getGameList = async (
    req: Request, 
    res: Response
) => {
    try {
        // 데이터베이스에서 모든 게임 정보 가져오기
        const games = await Game.find({}, "id name").lean(); // id와 name 필드만 가져오기
        return res.status(200).json(games);
    } catch (error) {
        console.error("[ERROR] Failed to fetch game list:", error.message);
        return res.status(500).json({ error: "Failed to fetch game list." });
    }
};

export const checkKeywordInChat = async ({
    userId,
    scenarioId,
    userResponse,
}) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        // 시나리오 키워드 가져오기
        const keywordDoc = await Keyword.findOne({ scenarioName: scenarioId });
        if (!keywordDoc) {
            throw new Error("No keywords found for the given scenario.");
        }

        // 키워드 매칭
        const matchedKeywords = keywordDoc.keywords.filter((keyword) =>
            userResponse.toLowerCase().includes(keyword.toLowerCase())
        );

        // 경험치 계산 및 업데이트
        let experienceGained = 0;
        if (matchedKeywords.length > 0) {
            experienceGained = matchedKeywords.length * 10;
            user.exp += experienceGained;
            await user.save();
        }

        // 결과 반환
        return {
            matchedKeywords,
            experienceGained,
            totalExperience: user.exp,
        };
    } catch (error) {
        console.error("[ERROR] Error in checkKeywordInChat:", error.message);
        throw new Error("An error occurred while processing the keyword matching game.");
    }
};

