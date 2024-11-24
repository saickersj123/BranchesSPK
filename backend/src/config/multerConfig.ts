import multer from "multer";
import path from "path";
import fs from "fs";

// 파일 저장 경로와 이름 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    
    // 'uploads' 폴더가 없을 경우 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    
    cb(null, uploadPath); // 파일을 저장할 폴더 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
export default upload;
