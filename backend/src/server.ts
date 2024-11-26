import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

import userRoutes from "./routes/UserRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import Routes from "./routes/Routes.js";
import voiceRoutes from "./routes/VoiceRoutes.js";  // VoiceRoutes 추가

config();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// Routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/", Routes);
app.use("/api", voiceRoutes);  // VoiceRoutes를 "/api" 경로에 추가

console.log("Routes added");

// Connections and Listeners
mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.z3bws8s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log(
      `Server started on port ${process.env.PORT || 5000} and MongoDB is connected`
    );
  })
  .catch((err) => {
    console.log(err);
  });
