import express from "express";
import { getGameList } from "../controllers/GameController.js";

const gameRoutes = express.Router();

// Get GameList
gameRoutes.get("/list", getGameList);

export default gameRoutes;
