import express from "express";
import multer from "multer";
import { verifyToken } from "../utils/Token.js";
import { fineTuneValidator, validate } from "../utils/Validators.js";
import { 
		 startNewConversation,
		 deleteConversation, 
         getConversation, 
         deleteAllConversations, 
         getAllConversations, 
         getAllScenarioConversations,
         startNewConversationUnified,
         generateChatCompletion,
         createCustomModel,
         deleteCustomModel,
         getCustomModels,
         getModelbyId,
         getAllScenarios,
         handleScenarioConversation
         } from "../controllers/ChatController.js";

const chatRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Test route
chatRoutes.get("/", (req, res) => {
    console.log("hi");
    res.send("hello from chatRoutes");
});

//new conversation
chatRoutes.get("/c/new", verifyToken, startNewConversation);

// Unified route for general conversations (text, voice)
chatRoutes.post(
    "/c/new",
    verifyToken,
    upload.single("audio"),
    (req, res, next) => {
        if (req.body.scenarioId) {
            handleScenarioConversation(req, res);
        } else {
            startNewConversationUnified(req, res);
        }
    }
);

// Resume conversation (text or voice)
chatRoutes.post(
    "/c/:conversationId",
    verifyToken,
    upload.single("audio"),
    generateChatCompletion
);

// Get all conversations (general + voice)
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

// Get all scenarios
chatRoutes.get("/scenarios", verifyToken, getAllScenarios);

export default chatRoutes;
