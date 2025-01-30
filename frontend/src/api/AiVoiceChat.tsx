import axiosInstance, { TEST_MODE } from './axiosInstance'; 
import { Message, Conversation } from '../@types/types';
import axios from 'axios';

// conversationId를 활용해 모든 음성대화 메시지를 가져오는 함수
export const fetchVoiceMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await axiosInstance.get(`/chat/v/${conversationId}`); 
  try {
      //  console.log("받은 fetchVoiceMessages" +JSON.stringify(response.data, null, 2));
      return response.data.conversation.chats || [];
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      return [];
    }
  };  

// 모든 conversationId를 가지고 오는 함수
export const fetchAllConversationIds = async (): Promise<Conversation[]> => {
  try {
    const response = await axiosInstance.get('/chat/all-v');
    //console.log("api상 대화 아이디 가져오기 응답 : ", response.data);
    return response.data.voiceConversations.map((conversation: any) => ({
      _id: conversation._id,
      chats: conversation.chats,
      createdAt: conversation.createdAt
    }));
  } catch (error) {
    console.error('대화 목록 가져오기 실패:', error);
    return [];
  }
};

// 새로운 음성대화를 시작하는 함수
export const startNewConversationVoice = async (): Promise<string> => {
  try {
    const response = await axiosInstance.get('/chat/v/new'); 
    return response.data.conversation._id;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('새로운 대화 시작 실패:', error.response.data);
      throw new Error(error.response.data.cause || '새로운 대화 시작에 실패했습니다.');
    } else {
      console.error('새로운 대화 시작 실패:', error);
      throw error;
    }
  }
};
   
// 음성 메시지 전송 함수
export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob): Promise<{ audioUrl: string; text: string; gptResponse: string }> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('type', 'voice');

  if (TEST_MODE) {
    // Dummy data for testing
    return { 
      audioUrl: 'http://example.com/path/to/mock/audio.wav', // Mock audio URL
      text: 'This is a mock response text.', // Mock text response 
      gptResponse: 'This is a mock GPT response.' // Mock gptResponse
    };
  }

  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    //console.log(response.data); 
    return  { 
      text: response.data.message, // Mock text response
      gptResponse: response.data.gptResponse, // Corrected to use gptResponse
      audioUrl: response.data.audioBuffer // Mock audio URL 
    }; 
  } catch (error) {
    console.error('Error sending voice message:', error);
    throw error;
  }
};

  
// 대화 삭제 API - 대화를 삭제하는 함수
export const deleteVoiceConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/chat/v/${conversationId}`);
    return response.status;
  } catch (error) {
    console.error('음성대화 삭제 실패:', error);
    throw error;
  }
};

// 모든 채팅 기록 삭제 API - 모든 채팅 기록을 삭제하는 함수
export const deleteAllVoiceChats = async (): Promise<any> => { 
  try {
    const response = await axiosInstance.delete('/chat/v/all');
    return response.status;
  } catch (error) {
    console.error('모든 음성대화 기록 삭제 실패:', error);
    throw error;
  } 
};

 