import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Keyword from "../models/Keyword.js";
import { generateChatCompletion } from "./ChatController.js";

export const checkKeywordInChatLevel = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json("User not registered / token malfunctioned");
        }

        const { scenarioName } = req.params; // 시나리오 이름만 가져오기
        const chatResponse = await generateChatCompletion(req, res, next);
        const message = req.body.message;

        // DB에서 해당 시나리오 이름에 맞는 키워드 가져오기
        const keywordDoc = await Keyword.findOne({ scenarioName });
        if (!keywordDoc) {
            return res.status(404).json({ message: "해당 시나리오에 대한 키워드가 없습니다." });
        }

        const containsKeyword = keywordDoc.keywords.some(keyword => message.includes(keyword));

        if (containsKeyword) {
            return res.status(200).json({ message: "키워드가 포함되어 있습니다.", matchedKeyword: true });
        } else {
            return res.status(200).json({ message: "키워드가 포함되어 있지 않습니다.", matchedKeyword: false });
        }
    } catch (error) {
        console.error("Error checking keywords:", error.message);
        return res.status(500).json({ message: error.message });
    }
};
