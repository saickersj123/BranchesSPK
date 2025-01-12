import axiosInstance, { API_MODE } from './axiosInstance';
import { Message } from '../@types/types';

// conversationId를 활용해 모든 음성대화 메시지를 가져오는 함수
export const fetchVoiceMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await axiosInstance.get(`/chat/v/${conversationId}`);
  return response.data;
};

// 모든 conversationId를 가지고 오는 함수
export const fetchAllConversationIds = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/chat/v/all');
  return response.data;
};

// 새로운 음성대화를 시작하는 함수
export const startNewConversationVoice = async (): Promise<string> => {
  const response = await axiosInstance.get('/chat/v/new'); 
  return response.data.conversation.id;
};
  
// 음성 메시지 전송 함수
export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob): Promise<{ audioUrl: string; text: string }> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
  
    if (API_MODE === 0) {
      // Dummy data for testing
      return {
        audioUrl: 'http://example.com/path/to/mock/audio.wav', // Mock audio URL
        text: 'This is a mock response text.' // Mock text response
      };
    }
  
    try {
      const response = await axiosInstance.post(`/chat/c/${conversationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; // Ensure this returns { audioUrl, text }
    } catch (error) {
      console.error('Error sending voice message:', error);
      throw error;
    }
  }; 