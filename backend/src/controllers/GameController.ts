import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import { generateChatCompletion } from "./ChatController.js"; // ChatController에서 가져오기

export const checkKeywordInChatLevel_1_cafe = async (  // 카페일시 아메리카노 뜨거운 아메리카노, 냅킨, 포장
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user){
            return res.status(401).json("User not registered / token malfunctioned");
        }
		// ChatController의 generateChatCompletion에서 메시지를 가져오는 로직
		const chatResponse = await generateChatCompletion(req, res, next);
		const message = req.body.message; // 사용자가 보낸 메시지

		// 여기에 확인할 키워드를 입력하세요
		const keywords = ["hot americano", "napkins", "to go please"]; // 예시 키워드

		// 메시지에 키워드가 포함되어 있는지 확인
		const containsKeyword = keywords.some(keyword => message.includes(keyword));

		if (containsKeyword) {
			return res.status(200).json({ message: "키워드가 포함되어 있습니다." });
		} else {
			return res.status(200).json({ message: "키워드가 포함되어 있지 않습니다." });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
}; 


export const checkKeywordInChatLevel_2_cafe = async (  
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user){
            return res.status(401).json("User not registered / token malfunctioned");
        }
		const chatResponse = await generateChatCompletion(req, res, next);
		const message = req.body.message; 

		const keywords = ["I'd like a cup of hot americano and water, please", "Could you give me a napkin by spilling the contents?", "Can I get the leftover drinks to go?"]; // 예시 키워드
		// 뜨거운 아메리카노, 내용물을 흘려 냅킨 요청, 남은 음료 포장
		const containsKeyword = keywords.some(keyword => message.includes(keyword));

		if (containsKeyword) {
			
			return res.status(200).json({ message: "키워드가 포함되어 있습니다." });
		} else {
			return res.status(200).json({ message: "키워드가 포함되어 있지 않습니다." });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
}; 

export const checkKeywordInOpenAIChat = async (req: Request, res: Response, next: NextFunction) => {
	try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json("User not registered / token malfunctioned");
        }
        const chatResponse = await generateChatCompletion(req, res, next);
        
        // chatResponse가 문자열인지 확인하고, 그렇지 않으면 적절한 처리를 합니다.
        const openAIMessage = typeof chatResponse === 'string' ? chatResponse : '';

        const keywords = ["키워드", "napkins", "to go please"];
        const containsKeyword = keywords.some(keyword => openAIMessage.toLowerCase().includes(keyword.toLowerCase()));

        if (containsKeyword) {
            return res.status(200).json({ message: "키워드가 포함되어 있습니다." });
        } else {
            return res.status(200).json({ message: "키워드가 포함되어 있지 않습니다." });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}; 