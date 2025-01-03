import axios from 'axios';
import axiosInstance from './axiosInstance';

// 사용자 경험치를 불러오는 API
export const gethUserExperience = async (): Promise<number> => {
    try {
      const response = await axiosInstance.get('/user/experience');
      console.log(response.data);
      return response.data.experience; // 경험치 반환
    } catch (error) {
      console.error('경험치 가져오기 실패:', error);
      throw error;
    }
  };
  
  // 과거에 참가한 게임의 정보를 얻어오는 API
  export const getPastGames = async (): Promise<{ gameName: string; participationTime: string; correctAnswers: number; experienceGained: number }[]> => {
    try {
      const response = await axiosInstance.get('/user/past-games');
      console.log(response.data);
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

  export const resetPassword = async (email: string, newPassword: string): Promise<any> => { 
    try {
      const response = await axiosInstance.post('/user/resetPassword', { email, newPassword });
      return response.data;
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      throw error;
    } 
  };
  
 
export const updatePassword = async (password: string): Promise<any> => { 
    try {
      const response = await axiosInstance.put('/user/update-password', { password });
      return response.data;
    } catch (error) {
      throw new Error('비밀번호 변경에 실패했습니다.');
    } 
  };
  
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