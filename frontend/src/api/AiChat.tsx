import axios from 'axios';
import axiosInstance, { API_MODE } from './axiosInstance';
import { AIScenario } from '../@types/scenarios';
import { DUMMY_SCENARIOS } from '../data/dummy_scenarios_types'; //임시의 더미 시나리오를 불러오는 용도암 
import { Message, Conversation } from '../@types/types';

export const startNewConversation = async (): Promise<string> => {
    try {
      const response = await axiosInstance.get('/chat/c/new');
      return response.data.conversation.id;
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
  
// 모든 시나리오 목록을 가져오는 함수 (임시 더미 데이터 반환)
export const getAllScenarios = async (): Promise<AIScenario[]> => {
    if (API_MODE === 1) {
      // 더미 데이터 모드
      return Promise.resolve(DUMMY_SCENARIOS); // DUMMY_SCENARIOS는 types.ts에서 import
    } else {
      // 실제 서버 통신 모드
      try {
        const response = await axiosInstance.get('/chat/scenarios');
        return response.data.scenarios;
      } catch (error) {
        console.error('시나리오 목록 가져오기 실패:', error);
        throw error;
      }
    }
  };
  
  // startNewConversationWithScenario 함수 수정
  export const startNewConversationWithScenario = async (
    scenarioId: string, 
    selectedRole: 'role1' | 'role2', 
  ): Promise<Conversation> => {
    if (API_MODE === 1) {
      // 더미 데이터 모드에서 선택된 정보 출력
      console.log('=== 시나리오 선택 정보 (테스트 모드) ===');
      console.log('선택된 시나리오 ID:', scenarioId);
      console.log('선택된 역할:', selectedRole);
      const selectedScenario = DUMMY_SCENARIOS.find(s => s._id === scenarioId);
      if (!selectedScenario) {
        throw new Error('선택된 시나리오를 찾을 수 없습니다.');
      }
      console.log('선택된 시나리오 상세:', selectedScenario);
      console.log('===============================');
      return Promise.resolve({
        _id: `temp_conversation_${Date.now()}`,
        chats: [],
        createdAt: new Date().toISOString(),
        title: selectedScenario.name // Assuming title is a required property in Conversation
      });
    } else {
      // 실제 서버 통신 모드
      try {
        const response = await axiosInstance.post('/chat/c/new/scenario', {
          scenarioId,
          selectedRole
        });
        return response.data.conversation;
      } catch (error) {
        console.error('시나리오 기반 대화 시작 실패:', error);
        throw error;
      }
    }
  };
  
  export const sendMessage = async (conversationId: string, messageContent: string, role: string = 'user'): Promise<Message[]> => {
    const message: Message = {
      role: role,
      content: messageContent,
      createdAt: new Date().toISOString() // 현재 시간을 ISO 문자열로 추가
    };
  
    try {
      const response = await axiosInstance.post(`/chat/c/${conversationId}`, { message : message.content });
      return response.data.chats;
    } catch (error) {
      console.error('메시지 보내기 실패:', error);
      throw error;
    }
  };
  
  export const deleteConversation = async (conversationId: string): Promise<any> => {
    try {
      const response = await axiosInstance.delete(`/chat/c/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('대화 삭제 실패:', error);
      throw error;
    }
  };
  
  export const deleteAllChats = async (): Promise<any> => { 
    try {
      const response = await axiosInstance.delete('/chat/all-c');
      return response.data;
    } catch (error) {
      console.error('모든 채팅 기록 삭제 실패:', error);
      throw error;
    } 
  };
  
export const startNewConversationwithmsg = async (messageContent: string, role: string = 'user'): Promise<Conversation> => {
    const message: Message = {
      role: role,
      content: messageContent,
      createdAt: new Date().toISOString() // 현재 시간을 ISO 문자열로 추가
    };
    try {
      const response = await axiosInstance.post('/chat/c/new', {message: message.content});
      return response.data.conversation;
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
   
  
  export const fetchConversations = async (): Promise<Conversation[]> => {
    try {
      const response = await axiosInstance.get('/chat/all-c');
      return response.data.conversations.map((conv: any) => ({
        _id: conv._id,
        chats: conv.chats,
        createdAt: conv.createdAt
      })) || [];
    } catch (error) {
      console.error('대화 목록 가져오기 실패:', error);
      return [];
    }
  };
  
  export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
    try {
      const response = await axiosInstance.get(`/chat/c/${conversationId}`);
      return response.data.conversation.chats || [];
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      return [];
    }
  }; 

  
// 음성 메시지 전송 함수
export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob): Promise<{ audioUrl: string; text: string }> => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
  
    if (API_MODE === 1) {
      // Dummy data for testing
      return {
        audioUrl: 'http://example.com/path/to/mock/audio.wav', // Mock audio URL
        text: 'This is a mock response text.' // Mock text response
      };
    }
  
    try {
      const response = await axiosInstance.post(`/chat/c/${conversationId}/voice`, formData, {
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