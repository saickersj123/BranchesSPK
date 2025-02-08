import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Scenario from "../models/Scenario.js";
import { configureOpenAI, ModelName } from "../config/openai.js";
import OpenAI from "openai";
import { saveModel, loadModel, deleteModel } from "../utils/modelStorage.js";
import { fineTuneModel, saveTrainingDataToFile, uploadTrainingData } from "../utils/fineTuneModel.js"
import { transcribeAudioToText, generateFineTunedResponse, generateSpeechFromText } from "../utils/VoiceChat.js";


export const generateChatCompletion = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const { conversationId } = req.params;
        const user = await User.findById(res.locals.jwtData.id);

        if (!user) {
            return res.status(401).json({ message: "ERROR", cause: "User not registered / token malfunctioned" });
        }

        // 특정 대화 가져오기
        const conversation = user.conversations.find(
            (conv) =>
                conv.id === conversationId || conv._id.toString() === conversationId
        );
        if (!conversation) {
            console.log("User Conversations:", user.conversations);
            return res.status(404).json({ message: "ERROR", cause: "Conversation not found" });
        }

        // 🔹 대화 타입 확인
        if (req.file) {
            // 음성 메시지가 포함된 경우 (음성 대화)
            console.log("Processing voice message...");
            conversation.type = "voice";
            return await handleGeneralConversation(req, res); // 음성 대화 처리
        } else {
            // 일반 텍스트 메시지
            console.log("Processing text message...");
        }

        // 일반 텍스트 메시지 처리
        const { message } = req.body;
        if (!message || message.trim() === "") {
            return res.status(400).json({ message: "ERROR", cause: "Empty message received" });
        }

        // 🔹 OpenAI API 호출을 위한 메시지 준비
        const chats = conversation.chats.map(({ role, content }: { role: string; content: string }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        conversation.chats.push({ content: message, role: "user" });

        // OpenAI 설정
        const config = configureOpenAI();
        const openai = new OpenAI(config);

        // OpenAI API 호출
        const chatResponse = await openai.chat.completions.create({
            model: ModelName,
            messages: chats as OpenAI.Chat.ChatCompletionMessageParam[],
        });

        // 응답 저장
        conversation.chats.push(chatResponse.choices[0].message);
        await user.save();

        return res.status(200).json({ chats: conversation.chats });
    } catch (error: unknown) {
        console.error(error);
        return res.status(500).json({ message: (error as Error).message });
    }
};


export const getAllConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}
		const generalConversations = user.conversations.filter(convo => convo.type !== "voice");
        return res.status(200).json({ message: "OK", conversations: generalConversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteAllConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}

        //@ts-ignore
        user.conversations = [];
        await user.save()
		return res.status(200).json({ message: "OK", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const startNewConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);

		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		
		// Validate if the last conversation is empty
		const lastConversation = user.conversations[user.conversations.length - 1];
		if (lastConversation && lastConversation.chats.length === 0) {
			return res.status(400).json({
				message: "ERROR",
				cause: "The last conversation is still empty. Please add messages before creating a new conversation.",
			});
		}

		user.conversations.push({ chats: [] });
		await user.save();

		return res.status(200).json({ message: "New conversation started", 
					conversation: user.conversations[user.conversations.length - 1]  });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const startNewConversationwith = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { message } = req.body;

		const user = await User.findById(res.locals.jwtData.id);
		if (!user) {
			return res.status(401).json("User not registered / token malfunctioned");
		}
		// Validate if the last conversation is empty
			const lastConversation = user.conversations[user.conversations.length - 1];
			if (lastConversation && lastConversation.chats.length === 0) {
				return res.status(400).json({
					message: "ERROR",
					cause: "The last conversation is still empty. Please add messages before creating a new conversation.",
				});
			}
		user.conversations.push({ chats: [] });
		// Add the user's message to the conversation
		const conversation = user.conversations[user.conversations.length - 1];

		// Prepare messages for OpenAI API
		const chats = conversation.chats.map(({ role, content }) => ({
			role,
			content,
		})) ;
		chats.push({ content: message, role: "user" });
		conversation.chats.push({ content: message, role: "user" });
		// send all chats with new ones to OpenAI API
		const config = configureOpenAI();
		const openai = new OpenAI(config);

		// make request to openAi
		// get latest response
		const chatResponse = await openai.chat.completions.create({
			model: ModelName,
			messages: chats as OpenAI.Chat.ChatCompletionMessageParam[],
		});
		// push latest response to db
		conversation.chats.push(chatResponse.choices[0].message);
		await user.save();

		return res.status(200).json({ conversation: conversation });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};


export const getConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		const { conversationId } = req.params;

		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		const conversation = user.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}
		await user.save();

		return res.status(200).json({ message: "OK", conversation });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const deleteConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id);
		const { conversationId } = req.params;

		if (!user) {
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});
		}

		const conversation = user.conversations.id(conversationId);
		if (!conversation) {
			return res.status(404).json({
				message: "ERROR",
				cause: "Conversation not found",
			});
		}

		// Remove the conversation
		user.conversations.pull(conversationId);
		await user.save();

		return res.status(200).json({ message: "OK", conversations: user.conversations });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};

export const createCustomModel = async (
	req: Request,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = res.locals.jwtData.id;
		const { trainingData, modelName } = req.body;
        const trainingFilePath = await saveTrainingDataToFile(trainingData);
        const trainingFileId = await uploadTrainingData(trainingFilePath);
	  	const fineTunedModel = await fineTuneModel(trainingFileId);
  
	  	saveModel(userId, fineTunedModel, modelName);
  
	  	res.status(201).json({ message: "Model fine-tuned and saved", model: fineTunedModel, trainingFileId });
	} catch (err) {
	  	res.status(500).json({ error: err.message });
	}
  };

export const deleteCustomModel = async (
	req: Request,
	res: Response,
	next: NextFunction) => {
	try {
		const userId = res.locals.jwtData.id;
	  	const { modelId } = req.params;
	  	deleteModel(userId, modelId);

	  	res.status(200).json({ message: "Model deleted" });
	} catch (err) {
	  	res.status(500).json({ error: err.message });
	}
  };

export const getCustomModels = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        
		if (!user)
			return res.status(401).json({
				message: "ERROR",
				cause: "User doesn't exist or token malfunctioned",
			});

		if (user._id.toString() !== res.locals.jwtData.id) {
			return res
				.status(401)
				.json({ message: "ERROR", cause: "Permissions didn't match" });
		}
		return res.status(200).json({ message: "OK", CustomModels: user.CustomModels });
	} catch (err) {
		console.log(err);
		return res.status(200).json({ message: "ERROR", cause: err.message });
	}
};

export const getModelbyId = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userId = res.locals.jwtData.id;
		const { modelId } = req.params;
		const model = await loadModel(userId, modelId);

		return res.status(200).json({ message: "OK", model });
	} catch (err) {
		console.log(err);
		return res.status(500).json({ message: "ERROR", cause: err.message });
	}
};
export const startNewConversationVoice = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);

        // 유저가 존재하지 않을 경우 처리
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }
        // Validate if the last conversation is empty
        const lastConversation = user.conversations[user.conversations.length - 1];
        if (lastConversation && lastConversation.chats.length === 0) {
            return res.status(400).json({
                message: "ERROR",
                cause: "The last conversation is still empty. Please add messages before creating a new conversation.",
            });
        }
        // 새 음성 대화 추가
        const newVoiceConversation = { 
            chats: [], 
            type: "voice", 
        };
        user.conversations.push(newVoiceConversation);

        // 변경 사항 저장
        await user.save();

        // 새로 생성된 대화 반환
        return res.status(200).json({
            message: "New voice conversation started",
            conversation: user.conversations[user.conversations.length - 1],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const getAllVoiceConversations = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id); // 이전 미들웨어에서 저장된 JWT 데이터 사용
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        // 권한 확인
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
        }

        // 음성 대화만 필터링
        const voiceConversations = user.conversations.filter(conversation => conversation.type === "voice");

        return res.status(200).json({
            message: "OK",
            voiceConversations,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};
export const getVoiceConversation = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id); // 현재 사용자를 가져옵니다.
        const { conversationId } = req.params; // URL 파라미터에서 conversationId를 가져옵니다.
        
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        // 음성 대화만 필터링
        const voiceConversations = user.conversations.filter(conversation => conversation.type === "voice");

        // 필터링된 대화에서 conversationId와 일치하는 대화 찾기
        
        const conversation = voiceConversations.find(conv => conv._id.toString() === conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: "ERROR",
                cause: "Voice conversation not found",
            });
        }

        await user.save(); // 사용자가 수정되었다면 저장합니다.
        
        return res.status(200).json({ message: "OK", conversation });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};
const saveVoiceConversation = async (
    userId: string,
    userMessage: string,
    gptMessage: string
) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // 마지막 대화 가져오기
        let conversation = user.conversations[user.conversations.length - 1];

        // ✅ 대화가 없으면 새 대화 생성 (Mongoose 모델 유지)
        if (!conversation) {
            const newConversation = new (user.conversations as any).constructor({
                type: "voice",
                chats: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            });


            user.conversations.push(newConversation);
            conversation = newConversation;
        }

        conversation.chats = (conversation.chats as any) || [];
        }

        // ✅ chats가 항상 배열이므로 TypeScript 오류 방지됨
        conversation.chats.push({ content: userMessage, role: "user", createdAt: new Date() });
        conversation.chats.push({ content: gptMessage, role: "assistant", createdAt: new Date() });
        conversation.updatedAt = new Date();

        


        // 사용자 저장
        await user.save();
    } catch (error) {
        console.error(`[ERROR] Failed to save conversation for user ${userId}:`, error.message);
        throw new Error("Failed to save conversation");
    }
};


export const handleGeneralConversation = async (
	req: Request,
	res: Response,
) => {
    try {
        const audioBuffer: Buffer | undefined = req.file?.buffer;
        if (!audioBuffer) {
            res.status(400).json({ error: "No audio data provided" });
            return;
        }
		if (req.file.size === 0) {
            console.error("[ERROR] Received an empty audio file.");
            res.status(400).json({ error: "Empty audio file received. Please try again." });
            return;
        }
        // 1. 음성 -> 텍스트 변환 (STT)
        let userText: string;
        try {
            userText = await transcribeAudioToText(audioBuffer);
        } catch (error: unknown) {
            console.error("[ERROR] Error in STT:", (error as Error).message);
            res.status(500).json({ error: "Failed to transcribe audio" });
            return;
        }

        // 2. GPT 응답 생성
        let gptResponse: { text: string };
        try {
            gptResponse = await generateFineTunedResponse(userText);
        } catch (error: unknown) {
            console.error("[ERROR] Error in GPT response generation:", (error as Error).message);
            res.status(500).json({ error: "Failed to generate GPT response" });
            return;
        }

        // 3. 대화 저장 (텍스트만 저장)
        try {
            await saveVoiceConversation(res.locals.jwtData.id, userText, gptResponse.text);
        } catch (error: unknown) {
            console.error("[ERROR] Failed to save conversation:", (error as Error).message);
            res.status(500).json({ error: "Failed to save conversation" });
            return;
        }

        // 4. 텍스트 -> 음성 변환 (TTS)
        let audioResponseBuffer: Buffer;
        try {
            audioResponseBuffer = await generateSpeechFromText(gptResponse.text);
        } catch (error: unknown) {
            console.error("[ERROR] Error in TTS:", (error as Error).message);
            res.status(500).json({ error: "Failed to generate speech from text" });
            return;
        }

        // ✅ 최종 응답: 변환된 텍스트 + GPT 응답 + 음성(Base64)
        res.json({
            message: userText, // 변환된 사용자 음성 텍스트
            role: "user",
            gptResponse: gptResponse.text, // GPT의 응답 텍스트
            audioBuffer: audioResponseBuffer.toString("base64"), // Base64 인코딩된 음성 데이터
        });

    } catch (error: unknown) {
        console.error("[ERROR] Error in handleGeneralConversation:", (error as Error).message);
        if (!res.headersSent) {
            res.status(500).json({ error: `Failed to process audio: ${(error as Error).message}` });
        }
    }
};


export const getAllScenarios = async (req: Request, res: Response): Promise<void> => {
    try {
        const scenarios = await ScenarioModel.find();
        res.status(200).json({ scenarios });
    } catch (error) {
        console.error("Error fetching scenarios:", error);
        res.status(500).json({ error: "Failed to fetch scenarios" });
    }
};

export const handleScenarioConversation = async (
    req: Request,
    res: Response,
) => {
    try {
        const audioBuffer: Buffer | undefined = req.file?.buffer;
        const { scenarioId, selectedRole, difficulty } = req.body;

        if (!audioBuffer) {
            res.status(400).json({ error: "No audio data provided" });
            return;
        }
		if (req.file.size === 0) {
            console.error("[ERROR] Received an empty audio file.");
            res.status(400).json({ error: "Empty audio file received. Please try again." });
            return;
        }
        if (!scenarioId || !selectedRole || !difficulty) {
            res.status(400).json({ error: "Scenario ID, role, and difficulty are required" });
            return;
        }

        const scenario = await ScenarioModel.findById(scenarioId);
        if (!scenario) {
            res.status(404).json({ error: "Scenario not found" });
            return;
        }
        if (!scenario.roles.includes(selectedRole)) {
            res.status(400).json({ error: `Invalid role. Available roles: ${scenario.roles.join(", ")}` });
            return;
        }

        // 1. 음성 -> 텍스트 변환 (STT)
        let userText: string;
        try {
            userText = await transcribeAudioToText(audioBuffer);
        } catch (error: unknown) {
            console.error("[ERROR] Error in STT:", (error as Error).message);
            res.status(500).json({ error: "Failed to transcribe audio" });
            return;
        }

        // 2. GPT 응답 생성
        let gptResponse: { text: string };
        try {
            gptResponse = await generateFineTunedResponse(userText, {
                scenarioName: scenario.name,
                selectedRole,
                difficulty,
            });
        } catch (error: unknown) {
            console.error("[ERROR] Error in GPT response generation:", (error as Error).message);
            res.status(500).json({ error: "Failed to generate GPT response" });
            return;
        }

        // 3. 대화 저장 (텍스트만 저장)
        try {
            await saveVoiceConversation(res.locals.jwtData.id, userText, gptResponse.text);
        } catch (error: unknown) {
            console.error("[ERROR] Failed to save conversation:", (error as Error).message);
            res.status(500).json({ error: "Failed to save conversation" });
            return;
        }

        // 4. 텍스트 -> 음성 변환 (TTS)
        let audioResponseBuffer: Buffer;
        try {
            audioResponseBuffer = await generateSpeechFromText(gptResponse.text);
        } catch (error: unknown) {
            console.error("[ERROR] Error in TTS:", (error as Error).message);
            res.status(500).json({ error: "Failed to generate speech from text" });
            return;
        }

        // ✅ 최종 응답: 변환된 텍스트 + GPT 응답 + 음성(Base64)
        res.json({
            message: userText, // 변환된 사용자 음성 텍스트
            role: "user",
            gptResponse: gptResponse.text, // GPT의 응답 텍스트
            audioBuffer: audioResponseBuffer.toString("base64"), // Base64 인코딩된 음성 데이터
        });

    } catch (error: unknown) {
        console.error("[ERROR] Error in handleScenarioConversation:", (error as Error).message);
        if (!res.headersSent) {
            res.status(500).json({ error: `Failed to process scenario conversation: ${(error as Error).message}` });
        }
    }
};

export const getAllScenarioConversations = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "ERROR", cause: "User not found" });
        }

        // `toObject()`를 사용하여 `type` 필드에 안전하게 접근
        const scenarioConversations = user.conversations
            .map(conv => conv.toObject()) // ✅ MongoDB 문서를 일반 객체로 변환
            .filter(conv => conv.type === "scenario");

        return res.status(200).json({ message: "OK", conversations: scenarioConversations });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

// ✅ palceholder 처리
// ✅ 시나리오 기반 응답 처리 (자동 변환 적용)
export const getScenarioChatResponse = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { scenarioName, ...userInput } = req.body;

        // ✅ MongoDB에서 시나리오 조회
        const scenario = await Scenario.findOne({ name: scenarioName });

        if (!scenario) {
            return res.status(404).json({ error: "Scenario not found" });
        }

        // ✅ 자동 변환된 응답 반환 (Scenario.ts에서 변환 처리)
        return res.json({ message: scenario.getFormattedResponse(userInput) });
    } catch (error) {
        next(error);
    }
};
