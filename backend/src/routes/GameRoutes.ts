import express from "express";
import { verifyToken } from "../utils/Token.js";
import { getAllGameList, getKeywords, postGame, postKeywords } from "../controllers/GameController.js";
import { getRecords } from "../controllers/GameRecordController.js";

const gameRoutes = express.Router();

// Get GameList
gameRoutes.get("/list", getAllGameList);
gameRoutes.post("/list", postGame);
gameRoutes.get("/keyword", getKeywords);
gameRoutes.post("/keyword", postKeywords);
gameRoutes.get("/records", verifyToken, getRecords);

export default gameRoutes;
