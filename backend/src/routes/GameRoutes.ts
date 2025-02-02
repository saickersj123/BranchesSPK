import express from "express";
import { getAllGameList, getKeywords, postGame, postKeywords } from "../controllers/GameController.js";

const gameRoutes = express.Router();

// Get GameList
gameRoutes.get("/list", getAllGameList);
gameRoutes.post("/list", postGame);
gameRoutes.get("/keyword", getKeywords);
gameRoutes.post("/keyword", postKeywords);
export default gameRoutes;
