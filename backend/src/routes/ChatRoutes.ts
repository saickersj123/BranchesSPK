import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import { verifyToken } from "../utils/Token.js";
import { fineTuneValidator, chatCompletionValidator, validate } from "../utils/Validators.js";
import { 
    startNewConversation, 
    deleteConversation, 
    getConversation, 
    deleteAllConversations, 
    getAllConversations, 
    getAllScenarioConversations, 
    generateChatCompletion, 
    createCustomModel, 
    deleteCustomModel, 
    getCustomModels, 
    getModelbyId, 
    startNewConversationwith, 
    getVoiceConversation, 
    getAllVoiceConversations, 
    getAllScenarios, 
    handleScenarioConversation, 
    handleGeneralConversation, 
    startNewConversationVoice 
} from "../controllers/ChatController.js";

const chatRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Test route
chatRoutes.get("/", (req: Request, res: Response) => {
    console.log("hi");
    res.send("hello from chatRoutes");
});

// New conversation
chatRoutes.get("/c/new", verifyToken, startNewConversation);

// New conversation with message
chatRoutes.post("/c/new", validate(chatCompletionValidator), verifyToken, startNewConversationwith);

// Resume conversation (text or voice)
chatRoutes.post("/c/:conversationId", verifyToken, upload.single("audio"), generateChatCompletion);

// Get all conversations 
chatRoutes.get("/all-c", verifyToken, getAllConversations);

// Get all scenario conversations
chatRoutes.get("/all-c/scenario", verifyToken, getAllScenarioConversations);

// Get a specific conversation
chatRoutes.get("/c/:conversationId", verifyToken, getConversation);

// Delete a specific conversation
chatRoutes.delete("/c/:conversationId", verifyToken, deleteConversation);

// Delete all conversations
chatRoutes.delete("/all-c", verifyToken, deleteAllConversations);

// Create custom model
chatRoutes.post("/g/create", validate(fineTuneValidator), verifyToken, createCustomModel);

// Delete custom model
chatRoutes.delete("/g/:modelId", verifyToken, deleteCustomModel);

// Get all custom models
chatRoutes.get("/all-g", verifyToken, getCustomModels);

// Get a specific custom model
chatRoutes.get("/g/:modelId/", verifyToken, getModelbyId);

// New voice conversation
chatRoutes.get("/v/new", verifyToken, startNewConversationVoice);

// Get all conversations (general + voice)
chatRoutes.get("/v/all", verifyToken, getAllVoiceConversations);

// Get a specific voice conversation
chatRoutes.get("/v/:conversationId", verifyToken, getVoiceConversation);

// New scenario conversation
chatRoutes.post("/s/new", verifyToken, upload.single("audio"), handleScenarioConversation);

// Get all scenarios
chatRoutes.get("/scenarios", verifyToken, getAllScenarios);

export default chatRoutes;
