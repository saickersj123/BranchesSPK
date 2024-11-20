import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url"; // __dirname 대체를 위해 추가
import { config } from "dotenv";

import userRoutes from "./routes/UserRoutes.js";
import chatRoutes from "./routes/ChatRoutes.js";
import Routes from "./routes/Routes.js";
import voiceRoutes from "./routes/VoiceRoutes.js"; // VoiceRoutes 추가

config();

// __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 환경 변수 검증
if (!process.env.MONGO_USER || !process.env.MONGO_PASSWORD || !process.env.PORT) {
  throw new Error("필수 환경 변수가 설정되지 않았습니다.");
}

// Middlewares
app.use(cors({ origin: process.env.ORIGIN_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));

// 정적 파일 제공 (uploads 디렉토리)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user/", userRoutes);
app.use("/api/chat/", chatRoutes);
app.use("/api/", Routes);
app.use("/api", voiceRoutes); // "/api" 하위에 연결


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
