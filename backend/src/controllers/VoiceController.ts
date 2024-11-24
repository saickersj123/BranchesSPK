import { Request, Response } from "express";
import VoiceFile from "../models/VoiceFile.js";
import s3 from "../config/awsConfig.js";
import multer from "multer";
import fs from "fs";
import path from "path";

// 업로드용 multer 설정
const upload = multer({ dest: "temp/" });

// S3에 파일 업로드 함수
const uploadFileToS3 = (filePath: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME as string,
      Key: `audio/${fileName}`,
      Body: fileContent,
      ContentType: "audio/wav",
    };

    s3.upload(params, (err: AWS.AWSError, data: AWS.S3.ManagedUpload.SendData) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // S3 파일 URL 반환
      }
    });
  });
};

// 음성 파일 업로드 핸들러
export const uploadVoiceFile = async (req: Request, res: Response) => {
  upload.single("audio")(req, res, async (err) => {
    if (err) {
      console.error("파일 업로드 실패:", err);
      return res.status(500).json({ message: "파일 업로드 실패", error: err });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ message: "파일이 없습니다." });
      }

      const filePath = req.file.path;
      const fileName = req.file.filename;

      // S3에 파일 업로드
      const fileUrl = await uploadFileToS3(filePath, fileName);

      // MongoDB에 파일 URL 저장
      const voiceFile = new VoiceFile({
        filename: fileName,
        path: fileUrl,
        contentType: req.file.mimetype,
        size: req.file.size,
        uploadDate: new Date(),
      });

      await voiceFile.save();
      fs.unlinkSync(filePath); // 임시 파일 삭제
      res.status(201).json({ message: "음성 파일이 성공적으로 저장되었습니다.", file: voiceFile });
    } catch (error) {
      console.error("음성 파일 저장 실패:", error);
      res.status(500).json({ message: "음성 파일 저장에 실패했습니다.", error });
    }
  });
};

// 모든 음성 파일 목록을 가져오는 핸들러
export const getAllVoiceFiles = async (req: Request, res: Response) => {
  try {
    const files = await VoiceFile.find();
    res.status(200).json(files);
  } catch (error) {
    console.error("파일 목록 가져오기 실패:", error);
    res.status(500).json({ message: "파일 목록을 가져오는 데 실패했습니다." });
  }
};
