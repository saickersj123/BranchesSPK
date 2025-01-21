import axios, { AxiosInstance } from 'axios';
import { AuthResponse } from '../@types/types';  // types.ts에서 Message와 Conversation을 import 

// 시나리오, 음성처리의 API 모드 설정 (true: 더미 데이터 모드, false: 실제 서버 통신 모드)
export let API_MODE = false;

// 모든 요청에 withCredentials 옵션을 설정
axios.defaults.withCredentials = true;

// axios 인스턴스 생성. 모든 요청에 이걸 사용하여 처리.
const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api', // API 요청의 기본 URL 설정
  headers: {
    'Content-Type': 'application/json', // 요청 헤더에 Content-Type을 application/json으로 설정
  },
  withCredentials: true, // 인스턴스 레벨에서 withCredentials 설정
});
 
  
// 인증 상태 확인 API - 사용자의 인증 상태를 반환하는 함수 : 이걸로 로그인여부 파악
export const checkAuthStatus = async (): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.get('/user/auth-status');
    if (response.data && response.data.message === "OK") {  
      return { valid: true, user: { name: response.data.name }, email: response.data.email };
    } else {
      console.log("인증 상태 확인 실패:", response.data);
      return { valid: false };
    }
  } catch (error) {
    console.error('인증 상태 확인 실패:', error);
    return { valid: false }; 
  }
}; 

export default axiosInstance;