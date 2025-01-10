import { Request, Response } from 'express';
import Record from '../models/record.js';
import User from '../models/User.js';

const checkUserExists = async (req: Request, res: Response) => {
    const { id: userId } = res.locals.jwtData;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "유저를 찾을 수 없습니다." });
    }
};

// 모든 기록 조회
export const getRecords = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    try {
        const records = await Record.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 기록 추가
export const addRecord = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    const { date, experience, keywordsMatched } = req.body;
    try {
        const newRecord = new Record({ date, experience, keywordsMatched });
        await newRecord.save();
        res.status(201).json(newRecord);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 특정 기록 조회
export const getRecordById = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    const { id } = req.params;
    try {
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }
        res.status(200).json(record);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 모든 기록 삭제
export const deleteAllRecords = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    try {
        await Record.deleteMany({});
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 특정 기록 업데이트
export const updateRecord = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    const { id } = req.params;
    const { date, experience, keywordsMatched } = req.body;
    try {
        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            { date, experience, keywordsMatched },
            { new: true, runValidators: true }
        );
        if (!updatedRecord) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};

// 특정 기록 삭제
export const deleteRecordById = async (req: Request, res: Response) => {
    await checkUserExists(req, res);
    const { id } = req.params;
    try {
        const deletedRecord = await Record.findByIdAndDelete(id);
        if (!deletedRecord) {
            return res.status(404).json({ message: '기록을 찾을 수 없습니다.' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: '서버 오류' });
    }
};


