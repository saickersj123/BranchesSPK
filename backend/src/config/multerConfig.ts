import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ES Module 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 저장 폴더 경로 설정
const uploadDir = path.resolve(__dirname, "../uploads");

// 폴더가 없으면 생성
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const uniqueName = `audio-${timestamp}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

export default upload;
