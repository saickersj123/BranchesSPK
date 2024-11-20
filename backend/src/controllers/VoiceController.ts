import { Request, Response } from "express";
import multerConfig from "../config/multerConfig.js";
import fs from "fs";

// 음성 파일 업로드 핸들러
export const uploadVoiceFile = async (req: Request, res: Response) => {
    // Multer로 파일 업로드 처리
    const upload = multerConfig.single("audio");

    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "파일 업로드 실패", error: err });
        }

        try {
            // 업로드된 파일 정보
            const file = req.file;

            if (!file) {
                return res.status(400).json({ message: "업로드된 파일이 없습니다." });
            }

            // 파일 정보 반환
            res.status(201).json({
                message: "음성 파일이 성공적으로 저장되었습니다.",
                filePath: file.path,
                fileName: file.filename,
                mimeType: file.mimetype,
                size: file.size,
            });
        } catch (error) {
            console.error("파일 처리 중 오류:", error);
            return res.status(500).json({ message: "파일 처리 중 오류가 발생했습니다.", error });
        }
    });
};
