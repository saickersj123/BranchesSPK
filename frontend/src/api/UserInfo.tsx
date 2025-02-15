import axios from 'axios';
import axiosInstance from './axiosInstance';
import exp from 'constants';

// 레벨별 필요 경험치 배열
const LEVEL_THRESHOLDS = [
    0, 60, 140, 250, 400, 600, 860, 1200, 1630, 2170, 
    2840, 3700, 4700, 5800, 7200, 8800, 10700, 13000, 16000, 20000
];

// 경험치로 레벨 계산하는 함수
const calculateLevel = (exp: number): number => {
    let level = 1;
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (exp >= LEVEL_THRESHOLDS[i]) {
            level = i + 1;
        } else {
            break;
        }
    }
    return level;
};

const calculateNextLevelXP = (exp: number): number | null => {
    const level = calculateLevel(exp);
    if (level >= LEVEL_THRESHOLDS.length) {
        return null; // 최대 레벨에 도달했을 때
    }
    return LEVEL_THRESHOLDS[level];
};

// 사용자 경험치를 불러오는 API - 사용자의 경험치와 계산된 레벨을 반환하는 함수
export const gethUserExperience = async (): Promise<{ exp: number, level: number, nextLevelXP: number | null }> => {
  try {
    const response = await axiosInstance.get('/user/exp');
    const exp = response.data.exp;
    return { 
        exp, 
        level: calculateLevel(exp),
        nextLevelXP: calculateNextLevelXP(exp)
    };
} catch (error) {
    console.error('경험치 가져오기 실패:', error);
    throw error;
}
};
  
// 과거에 참가한 게임의 정보를 얻어오는 API - 과거에 참가한 게임의 정보를 반환하는 함수
  export const getPastGames = async (): Promise<{ gameName: string; participationTime: string; correctAnswers: number; experienceGained: number }[]> => {
    try {
      const response = await axiosInstance.get('/user/past-games'); 
      return response.data.games.map((game: any) => ({
        gameName: game.name,
        participationTime: game.participationTime,
        correctAnswers: game.correctAnswers,
        experienceGained: game.experienceGained,
      })) || [];
    } catch (error) {
      console.error('과거 게임 정보 가져오기 실패:', error);
      return [];
    } 
  };
  
  
// 로그인 요청 - 사용자의 이메일과 비밀번호를 받아서 로그인 요청을 보내는 함수
export const loginUser = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axiosInstance.post('/user/login', { email, password });
      if (response.status === 200 && response.data.message === "OK") {
        return {
          success: true,
          message: "OK",
          data: response.data
        };
      } else {
        return {
          success: false,
          message: response.data.message || '로그인에 실패했습니다.'
        };
      }
    } catch (error) {
      console.error('로그인 요청 실패:', error);
      return {
        success: false,
        message: '로그인에 실패했습니다.',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  };
  
// 로그아웃 요청 - 로그아웃 요청을 보내는 함수
  export const logout = async (): Promise<boolean> => { 
    try {
      const response = await axiosInstance.get('/user/logout');
      if (response.data.message === "OK" || response.status === 200 || response.status === 304) { 
        return true;
      } else {
        console.error('로그아웃 실패:', response.data);
        return false;
      }
    } catch (error) {
      console.error('로그아웃 실패:', error);
      return false;
    } 
  };

// 회원가입 요청 - 사용자의 이메일, 비밀번호, 닉네임을 받아서 회원가입 요청을 보내는 함수
export const signupUser = async (email: string, password: string, name: string): Promise<any> => { 
    try {
      const response = await axiosInstance.post('/user/signup', { email, password, name });
      return {
        success: response.status === 201,
        ...response.data
      };
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    } 
  }; 
  
// 비밀번호 변경 요청 - 사용자의 수정할 비밀번호를 받아서 비밀번호 변경 요청을 보내는 함수
export const updatePassword = async (password: string): Promise<any> => { 
    try {
      const response = await axiosInstance.put('/user/update-password', { password });
      return response.data;
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    } 
  };
  
// 닉네임 변경 요청 - 사용자의 수정할 닉네임을 받아서 닉네임 변경 요청을 보내는 함수
  export const updatename = async (name: string): Promise<any> => { 
    try {
      const response = await axiosInstance.put('/user/update-name', { name });
      return response.data;
    } catch (error) {
      throw new Error('닉네임 변경에 실패했습니다.');
    } 
  };
  
  
export const mypage = async (password: string): Promise<any> => { 
    try {
      const response = await axiosInstance.post('/user/mypage', { password });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
        return {
          message: "ERROR",
          cause: "Incorrect Password"
        };
      }
      console.error('비밀번호 인증 실패:', error);
      throw error;
    } 
  }; 