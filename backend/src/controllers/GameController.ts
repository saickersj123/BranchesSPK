import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Keyword from "../models/Keyword.js";
import Game from "../models/Game.js";
import Scenario from "../models/Scenario.js";
import Record from "../models/GameRecord.js";

// Return gamelist
export const getAllGameList = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        // 데이터베이스에서 모든 게임 정보 가져오기
        const games = await Game.find(); 
        res.status(200).json(games);
    } catch (error) {
        console.error("[ERROR] Failed to fetch game list:", error.message);
        res.status(500).json({ error: "Failed to fetch game list." });
    }
};

export const postGame = async (req: Request, res: Response): Promise<void> => {
    try {
        const { gameName, description } = req.body; // 요청에서 게임 데이터 추출

        // gameName이 없는 경우 400 에러 반환
        if (!gameName) {
            res.status(400).json({ message: "Game name is required" });
            return;
        }

        // 새로운 게임 객체 생성 및 저장
        const newGame = new Game({ game: gameName, description: description || "" });
        const savedGame = await newGame.save(); // MongoDB에 저장

        res.status(201).json(savedGame); // 성공 응답
    } catch (error) {
        console.error("Error in postGame:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkKeywordInChat = async ({ 
    userId, 
    scenarioId, 
    userResponses 
}) => {
    try {
        // 사용자 조회
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found.");

        // 시나리오 키워드 가져오기
        const keywordDoc = await Keyword.findOne({ scenario: scenarioId });
        if (!keywordDoc) throw new Error("No keywords found for the given scenario.");

        // 키워드 매칭
        const combinedResponse = userResponses.join(' ').toLowerCase();
        const matchedKeywords = keywordDoc.keywords.filter((keyword) =>
            combinedResponse.includes(keyword.toLowerCase())
        );

        // 경험치 계산 및 업데이트
        const experienceGained = matchedKeywords.length * 10;
        if (experienceGained > 0) {
            user.exp += experienceGained;
            await user.save();
        }

        // 최종 경험치 반환
        return { matchedKeywords, experienceGained };

    } catch (error) {
        console.error("[ERROR] Error in checkKeywordInChat:", error.message);
        throw new Error("An error occurred while processing the keyword matching game.");
    }
};

export const executeGameLogic = async ({ 
    gameId, 
    conversation, 
    res 
}) => {
    if (!gameId) {
        console.log("No game selected. Skipping game logic.");
        return null;
    }

    const userId = await User.findById(res.locals.jwtData.id);

    try {
        const scenarioId = conversation?.scenarioData?.scenarioId;

        // ✅ 게임 정보 조회 (gameId 기반)
        const gameData = await Game.findById(gameId);
        if (!gameData) {
            console.log(`Game with ID ${gameId} not found.`);
            return null;
        }
        const gameType = gameData.game; // 🔹 게임 타입 ("keyword", "score" 등)
        console.log(`Loaded game data: ${gameType}`);

        // 🔹 게임 타입별 컨트롤러 매핑 (향후 확장을 고려)
        const gameControllerMap = {
            keyword: checkKeywordInChat,
            // score: checkScoreInChat, // 추후 추가 가능
            // trivia: checkTriviaAnswer, // 추후 추가 가능
        };
        

        // ✅ 저장된 대화 점검 후 게임 로직 실행
        const gameLogic = gameControllerMap[gameType];
        if (gameLogic) {
            console.log(`🎯 Executing game logic for scenarioId=${scenarioId}`);
            // 🔹 chats 배열에서 userResponses 추출
            const userResponses = conversation.chats
                .filter(chat => chat.role === 'user') // 사용자 발화만
                .map(chat => chat.content);

            const gameResult = await gameLogic({
                userId,
                scenarioId,
                userResponses
            });

            // Record 생성 및 저장
            if (gameResult) {
                const newRecord = new Record ({
                    date: new Date(),
                    experience: gameResult.experienceGained,
                    matched: gameResult.matchedKeywords.length,
                    userId,
                    scenarioId,
                    gameId,
                });

                await newRecord.save();
            }

            return gameResult ?? null;
        } else {
            console.warn(`⚠️ No handler for game type: ${gameType}`);
            return null;
        }
    }
    catch (error) {
        console.error("Error in executeGameLogic:", error);
    }
};

export const postKeywords = async (
    req: Request, 
    res: Response
): Promise<void> => {
    try {
        const { scenarioId, newKeywords } = req.body;

        // ✅ 필수 데이터 검증
        if (!scenarioId || !newKeywords || !Array.isArray(newKeywords) || newKeywords.length === 0) {
            res.status(400).json({ error: "Missing required fields: scenarioId or non-empty newKeywords array." });
            return;
        }

        // ✅ 시나리오 존재 여부 확인
        const scenarioExists = await Scenario.findById(scenarioId);
        if (!scenarioExists) {
            res.status(404).json({ error: `Scenario with ID '${scenarioId}' not found.` });
            return;
        }

        // ✅ 기존 키워드 문서 찾기
        let keywordDoc = await Keyword.findOne({ scenario: scenarioId });

        if (keywordDoc) {
            // ✅ 기존 키워드에 새로운 키워드 추가 (중복 방지)
            const updatedKeywords = Array.from(new Set([...keywordDoc.keywords, ...newKeywords])); // 중복 제거
            keywordDoc.keywords = updatedKeywords;
        } else {
            // ✅ 키워드 문서가 없으면 새로 생성
            keywordDoc = new Keyword({
                scenario: scenarioId,
                keywords: newKeywords,
            });
        }

        // ✅ 변경 사항 저장
        await keywordDoc.save();

        // ✅ 성공 응답 반환
        res.status(201).json({
            message: "Keywords added successfully",
            keywords: keywordDoc.keywords,
        });

    } catch (error) {
        console.error("Error adding keywords:", error.message);
        res.status(500).json({ error: "Failed to add keywords." });
    }
};

export const getKeywords = async (
    req: Request, 
    res:Response
): Promise<void> => {
    try {
        // 데이터베이스에서 모든 키워드 가져오기
        const keywords = await Keyword.find();
        res.status(200).json(keywords);
    }
    catch (error) {
        console.error("[ERROR] Failed to fetch game list:", error.message);
        res.status(500).json({ error: "Failed to fetch game list." });
    }
};

