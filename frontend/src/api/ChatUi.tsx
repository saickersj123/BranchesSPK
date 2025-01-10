import axiosInstance from './axiosInstance';
import axios from 'axios';
import { ChatboxCoordinates } from '../@types/types';

// 채팅박스 좌표를 가져오는 API - 채팅박스 좌표를 반환하는 함수
export const getChatboxes = async (): Promise<ChatboxCoordinates | null> => {
    try {
      const response = await axiosInstance.get('/user/cbox');
      const chatboxes = response.data.chatboxes; 
      
      if (chatboxes.length === 0) {
        return null;
      }
      
      // 가장 최근의 chatbox 찾기
      const latestChatbox = chatboxes.reduce((latest: any, current: any) => {
        return new Date(latest.createdAt) > new Date(current.createdAt) ? latest : current;
      }, chatboxes[0]);
  
      return latestChatbox;
    } catch (error) {
      console.error('좌표값 가져오기 실패:', error);
      throw error;
    }
  };
  
// 채팅박스 저장하는 API - 채팅박스 좌표를 받아서 채팅박스 저장 요청을 보내는 함수
  export const saveChatbox = async (chatbox: ChatboxCoordinates): Promise<any> => {
    try {
      const response = await axiosInstance.post('/user/cbox', chatbox);
      return response.data;
    } catch (error) {
      console.error('표값 저장하기 실패:', error);
      throw error;
    }
  };
  
// 채팅박스 초기화하는 API - 채팅박스 초기화 요청을 보내는 함수
  export const resetChatbox = async (): Promise<any> => {
    try {
      const response = await axiosInstance.put('/user/cbox/reset');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('응답 오류:', error.response.data);
        } else if (error.request) {
          console.error('요청 오류:', error.request);
        } else {
          console.error('설정 오류:', error.message);
        }
      } else {
        console.error('알 수 없는 오류:', error);
      }
      throw error;
    }
  };