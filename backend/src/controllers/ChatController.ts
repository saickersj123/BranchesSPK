import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";
import Scenario from "../models/Scenario.js";
import Game from "../models/Game.js";
import { configureOpenAI, ModelName } from "../config/openai.js";
import OpenAI from "openai";
import mongoose, { Types } from "mongoose";
import { saveModel, loadModel, deleteModel } from "../utils/modelStorage.js";
import { fineTuneModel, saveTrainingDataToFile, uploadTrainingData } from "../utils/fineTuneModel.js"
import { transcribeAudioToText, generateFineTunedResponse, generateSpeechFromText } from "../utils/VoiceChat.js";
import { checkKeywordInChat, executeGameLogic } from "./GameController.js";


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
        const { type } = req.body;
        if (type === "scenario" && req.file) {
            console.log("Processing scenario conversation...");
            conversation.type = "scenario";
            return await handleScenarioConversation(req, res); // 시나리오 대화 처리

        } else if (type === "voice" && req.file) {
            console.log("Processing voice message...");
            conversation.type = "voice";
            return await handleGeneralConversation(req, res); // 음성 대화 처리

        } else {
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
      const generalConversations = user.conversations.filter(convo => convo.type !== "voice" && convo.type !== "scenario");
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

export const deleteAllVoiceConversations = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
        }

        // 음성 대화만 필터링하여 삭제
        //@ts-ignore
        user.conversations = user.conversations.filter(
            (conversation) => conversation.type !== "voice"
        );

        await user.save();

        return res.status(200).json({ message: "OK", conversations: user.conversations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const deleteVoiceConversation = async (
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

        // 특정 conversationId에 해당하는 대화 가져오기
        const conversation = user.conversations.id(conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: "ERROR",
                cause: "Conversation not found",
            });
        }

        // 삭제하려는 대화가 음성 대화인지 확인
        if (conversation.type !== "voice") {
            return res.status(400).json({
                message: "ERROR",
                cause: "The conversation is not a voice type",
            });
        }

        // 음성 대화 삭제
        user.conversations.pull(conversationId);
        await user.save();

        return res.status(200).json({ message: "OK", conversations: user.conversations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const saveVoiceConversation = async (
    userId: string,
    userMessage: string,
    gptMessage: string,
) => {
    try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        // 마지막 대화 가져오기
        let conversation = user.conversations[user.conversations.length - 1] as {
            type: string;
            chats: Types.DocumentArray<any>;
            createdAt: Date;
            updatedAt: Date;
        };


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

        // ✅ chats가 항상 배열이므로 TypeScript 오류 방지됨
        conversation.chats.push({ content: userMessage, role: "user", createdAt: new Date() });
        conversation.chats.push({ content: gptMessage, role: "assistant", createdAt: new Date() });
        conversation.updatedAt = new Date();

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

        // 3. 텍스트 -> 음성 변환 (TTS)
        let audioResponseBuffer: Buffer;
        try {
            audioResponseBuffer = await generateSpeechFromText(gptResponse.text);
        } catch (error: unknown) {
            console.error("[ERROR] Error in TTS:", (error as Error).message);
            res.status(500).json({ error: "Failed to generate speech from text" });
            return;
        }

        // 4. 대화 저장
        try {
            await saveVoiceConversation(
                res.locals.jwtData.id,
                userText,
                gptResponse.text,
            );
        }
        catch (error) {
            console.error("[ERROR] Failed to save conversation:", error.message);
            res.status(500).json({ error: "Failed to save conversation" });
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

export const startNewConversationScenario = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);

        // 유저 검증
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        // 요청에서 시나리오 정보 가져오기
        const { scenarioId, selectedRole, difficulty, gameId = null } = req.body;

        // 필수 데이터 확인
        if (!scenarioId || !selectedRole || !difficulty) {
            return res.status(400).json({
                error: "Scenario ID, role, and difficulty are required.",
            });
        }

        // 새 시나리오 대화 생성
        const newScenarioConversation = {
            type: "scenario",
            scenarioData: { // 🔹 시나리오 전용 데이터 저장
                scenarioId,
                selectedRole,
                difficulty,
                gameId
            }, // 게임 ID (없으면 null)
            chats: [],
        };

        user.conversations.push(newScenarioConversation);
        await user.save();

        // 새로 생성된 대화 반환
        return res.status(200).json({
            message: "New scenario conversation started",
            conversation: user.conversations[user.conversations.length - 1],
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};


export const getAllScenarioConversations = async (
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
        // 시나리오 대화만 필터링
        const scenarioConversations = user.conversations.filter(conversation => conversation.type === "scenario");
        return res.status(200).json({
            message: "OK",
            scenarioConversations,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const getScenarioConversation = async (
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

        // 시나리오 대화만 필터링
        const scenarioConversations = user.conversations.filter(conversation => conversation.type === "scenario");

        // 필터링된 대화에서 conversationId와 일치하는 대화 찾기
        
        const conversation = scenarioConversations.find(conv => conv._id.toString() === conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: "ERROR",
                cause: "Scenario conversation not found",
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

export const deleteAllScenarioConversations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await User.findById(res.locals.jwtData.id); // get variable stored in previous middleware
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).json({ message: "ERROR", cause: "Permissions didn't match" });
        }

        // 시나리오 대화만 필터링하여 삭제
        //@ts-ignore
        user.conversations = user.conversations.filter(
            (conversation) => conversation.type !== "scenario"
        );

        await user.save();

        return res.status(200).json({ message: "OK", conversations: user.conversations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const deleteScenarioConversation = async (
    req: Request,
    res: Response, 
    next: NextFunction,
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

        // 특정 conversationId에 해당하는 대화 가져오기
        const conversation = user.conversations.id(conversationId);

        if (!conversation) {
            return res.status(404).json({
                message: "ERROR",
                cause: "Conversation not found",
            });
        }

        // 삭제하려는 대화가 시나리오 대화인지 확인
        if (conversation.type !== "scenario") {
            return res.status(400).json({
                message: "ERROR",
                cause: "The conversation is not a voice type",
            });
        }

        // 시나리오 대화 삭제
        user.conversations.pull(conversationId);
        await user.save();

        return res.status(200).json({ message: "OK", conversations: user.conversations });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "ERROR", cause: err.message });
    }
};

export const saveScenarioConversation = async (
    userId,
    userMessage,
    gptMessage,
) => {
    try {
        const user = await User.findById(userId);
        if (!user)
            throw new Error("User not found");
        // 마지막 대화 가져오기
        let conversation = user.conversations[user.conversations.length - 1] as {
            type: string;
            chats: Types.DocumentArray<any>;
            createdAt: Date;
            updatedAt: Date;
        };
        // 대화가 없으면 새 대화 생성
        if (!conversation || !conversation.chats) {
            conversation = { type: "scenario", chats: [] as mongoose.Types.DocumentArray<any>, createdAt: new Date(), updatedAt: new Date() };
            user.conversations.push(conversation);
        }
        // 메시지 추가
        conversation.chats.push({ content: userMessage, role: "user", createdAt: new Date() });
        conversation.chats.push({ content: gptMessage, role: "assistant", createdAt: new Date() });
        conversation.updatedAt = new Date();
        // 사용자 저장
        await user.save();
    }
    catch (error) {
        console.error(`[ERROR] Failed to save conversation for user ${userId}:`, error.message);
        throw new Error("Failed to save conversation");
    }
};

export const handleScenarioConversation = async (
    req: Request,
    res: Response
) => {
    try {
        const { conversationId } = req.params;

        // 필수 데이터 확인
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID is required." });
        }

        // 유저 조회
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({
                message: "ERROR",
                cause: "User doesn't exist or token malfunctioned",
            });
        }

        // ✅ 대화 조회
        const conversation = user.conversations.find(conv => conv._id.toString() === conversationId);
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found." });
        }

        // ✅ 시나리오 대화 종료 여부 확인
        if (conversation.scenarioData?.isEnded) {
            return res.status(403).json({ error: "Conversation has already ended." });
        }

        // ✅ 기존 시나리오 데이터 가져오기
        const { scenarioId, selectedRole, difficulty, gameId, isEnded } = conversation.scenarioData;

        // 사용자 입력 처리
        let userText = null;
        let userAudioBuffer = null;

        if (req.file?.buffer) {
            try {
                userAudioBuffer = req.file.buffer;
                userText = await transcribeAudioToText(userAudioBuffer);
            } catch (error) {
                return res.status(500).json({ error: "Failed to transcribe audio" });
            }
        } else {
            return res.status(400).json({ error: "No audio data provided." });
        }

        // ✅ 작별 인사 감지 후 시나리오 종료
        const farewellKeywords = ["bye", "goodbye", "see you", "later", "exit", "quit", "end", "stop"];
        const lowerUserText = userText?.toLowerCase() || "";

        if (farewellKeywords.some(keyword => lowerUserText.includes(keyword))) {
            // DB에서 시나리오 대화의 scenarioData.isEnded 플래그 설정
            await User.updateOne(
                { _id: user._id, "conversations._id": conversationId },
                { $set: { "conversations.$.scenarioData.isEnded": true } } // 🔹 scenarioData 내부 업데이트
            );

            const goodbyeText = "Goodbye! The conversation has ended.";
            const goodbyeAudioBuffer = await generateSpeechFromText(goodbyeText);
            
            let gameResult = null;
            if (gameId) {
                gameResult = await executeGameLogic({ gameId: gameId.toString(), conversation, res});
            }

            return res.json({
                message: userText,
                role: "user",
                gptResponse: goodbyeText,
                gptAudioBuffer: goodbyeAudioBuffer?.toString("base64") || null,
                gameResult,
                conversationEnded: true,
            });
        }

        // GPT 응답 생성
        let gptResponse;
        try {
            gptResponse = await generateFineTunedResponse(userText, {
                scenarioId: scenarioId.toString(),
                selectedRole,
                difficulty,
            });
        } catch (error) {
            return res.status(500).json({ error: "Failed to generate GPT response" });
        }

        // GPT 응답을 TTS 변환하여 별도 저장
        let gptAudioBuffer = null;
        try {
            gptAudioBuffer = await generateSpeechFromText(gptResponse.text);
        } catch (error) {
            console.error("TTS generation failed:", error);
        }

        // 대화 기록 저장
        try {
            await saveScenarioConversation(res.locals.jwtData.id, userText, gptResponse.text);
        } catch (error) {
            return res.status(500).json({ error: "Failed to save conversation" });
        }

        // 최종 응답 반환
        return res.json({
            message: userText,
            role: "user",
            gptResponse: gptResponse.text,
            gptAudioBuffer: gptAudioBuffer ? gptAudioBuffer.toString("base64") : null,
        });
    } catch (error) {
        console.error("[ERROR] Error in handleScenarioConversation:", error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: `Failed to process scenario conversation: ${error.message}` });
        }
    }
};


export const getAllScenarios = async (
    req: Request,
    res: Response
    ): Promise<void> => {
    try {
        const scenarios = await Scenario.find();
        res.status(200).json({ scenarios });
    } catch (error) {
        console.error("Error fetching scenarios:", error);
        res.status(500).json({ error: "Failed to fetch scenarios" });
    }
};

export const postScenario = async (req, res) => {
    try {
        const { name, description, roles, difficulty, fineTunedModel } = req.body;
        
        // 필수 데이터 검증
        if (!name || !description || !roles || difficulty === undefined) {
            return res.status(400).json({ error: "Missing required fields: name, description, roles, or difficulty." });
        }

        // `roles`가 배열인지 검증
        if (!Array.isArray(roles) || roles.length === 0) {
            return res.status(400).json({ error: "Roles must be a non-empty array." });
        }

        // `difficulty`가 1~3 범위인지 검증
        if (difficulty < 1 || difficulty > 3) {
            return res.status(400).json({ error: "Difficulty must be a number between 1 and 3." });
        }

        // 시나리오 중복 확인
        const existingScenario = await Scenario.findOne({ name });
        if (existingScenario) {
            return res.status(400).json({ error: "Scenario already exists." });
        }

        // 새로운 시나리오 생성
        const newScenario = new Scenario({
            name,
            description,
            roles,
            difficulty,
            fineTunedModel,
        });

        // 데이터베이스 저장
        await newScenario.save();
        return res.status(201).json({ message: "Scenario created successfully", scenario: newScenario });
    } catch (error) {
        console.error("Error creating scenario:", error.message);
        return res.status(500).json({ error: "Failed to create scenario." });
    }
};

export const deleteScenario = async (req, res) => {
    try {
        const { id } = req.params;

        // `id`가 제공되지 않은 경우
        if (!id) {
            return res.status(400).json({ error: "Scenario ID is required." });
        }

        // 해당 시나리오가 존재하는지 확인
        const scenario = await Scenario.findById(id);
        if (!scenario) {
            return res.status(404).json({ error: "Scenario not found." });
        }

        // 데이터베이스에서 삭제
        await Scenario.findByIdAndDelete(id);

        return res.status(200).json({ message: "Scenario deleted successfully." });
    } catch (error) {
        console.error("Error deleting scenario:", error.message);
        return res.status(500).json({ error: "Failed to delete scenario." });
    }
};
