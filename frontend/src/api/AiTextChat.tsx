import axios from 'axios';
import axiosInstance  from './axiosInstance'; 
import { Message, Conversation } from '../@types/types';

// 새로운 대화 시작 API - 새로운 대화를 시작하는 함수
export const startNewConversation = async (): Promise<string> => {
  try {  
    const response = await axiosInstance.get('/chat/c/new'); 
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

// 메시지 보내기 API => {
export const startNewConversationwithmsg = async (messageContent: string, role: string = 'user'): Promise<Conversation> => {
  const message: Message = {
    role: role,
    content: messageContent,
    createdAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 추가
    audioUrl: ''
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
 
  
// 메시지 보내기 API - 메시지를 보내는 함수
export const sendMessage = async (conversationId: string, messageContent: string, role: string = 'user'): Promise<Message[]> => {
  const message: Message = {
    role: role,
    content: messageContent,
    createdAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 추가
    audioUrl: ''
  };

  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, { message: message.content }); 
    return response.data.chats;
  } catch (error) {
    console.error('메시지 보내기 실패:', error);
    throw error;
  }
};
  
// 대화 삭제 API - 대화를 삭제하는 함수
export const deleteConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/chat/c/${conversationId}`);
    return response.status;
  } catch (error) {
    console.error('대화 삭제 실패:', error);
    throw error;
  }
};
  
// 모든 채팅 기록 삭제 API - 모든 채팅 기록을 삭제하는 함수
export const deleteAllChats = async (): Promise<any> => { 
  try {
    const response = await axiosInstance.delete('/chat/all-c');
    return response.status;
  } catch (error) {
    console.error('모든 채팅 기록 삭제 실패:', error);
    throw error;
  } 
};

// 메시지 보내기 API - 메시지를 보내는 함수
export const starNewConversationwithmsg = async (messageContent: string, role: string = 'user'): Promise<Conversation> => {
    const message: Message = {
      role: role,
      content: messageContent,
      createdAt: new Date().toISOString(), // 현재 시간을 ISO 문자열로 추가
      audioUrl: ''
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
   
// 대화 목록 가져오기 API - 대화 목록을 가져오는 함수
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
  
// 메시지 가져오기 API - 메시지를 가져오는 함수
export const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  try {
    const response = await axiosInstance.get(`/chat/c/${conversationId}`); 
    return response.data.conversation.chats || [];
  } catch (error) {
    console.error('메시지 가져오기 실패:', error);
    return [];
  }
};  