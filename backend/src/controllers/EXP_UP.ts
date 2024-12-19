import { Request, Response, NextFunction } from 'express';
import User from '../models/User.ts';

export const addUserExp = async (req: Request, res: Response) => {
	try {
		const { exp } = req.body;
		const { userId } = req.params;
		const user = await User.findOne({ id: userId });
		if (!user) {
			res.status(404).json({ msg: '유저를 찾을 수 없습니다.' });
			return;
		}
		user.exp += exp;
		await user.save();
		return res.status(200).json({ message: "OK", exp: user.exp });
	} catch (error: any) {
		console.error('사용자의 경험치를 올릴수 없습니다.:', error);
		res.status(500).send('서버 에러');
	}
};

export const deleteUserExp = async (req: Request, res: Response) => {
	try {
		const { exp } = req.body;
		const { userId } = req.params;
		const user = await User.findOne({ id: userId });
		if (!user) {
			res.status(404).json({ msg: '유저를 찾을 수 없습니다.' });
			return;
		}
		user.exp -= exp;
		await user.save();
		return res.status(200).json({ message: "OK", exp: user.exp });
	} catch (error: any) {
		console.error('사용자의 경험치를 올릴수 없습니다.:', error);
		res.status(500).send('서버 에러');
	}
};

export const seeUserExp = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const user = await User.findOne({ id: userId });
		if (!user) {
			res.status(404).json({ msg: '유저를 찾을 수 없습니다.' });
			return;
		}
		return res.status(200).json({ message: "OK", exp: user.exp });
	} catch (error: any) {
		console.error('사용자의 경험치를 찾을 수 없습니다.', error); 
		res.status(500).send('서버 에러');
	}
};