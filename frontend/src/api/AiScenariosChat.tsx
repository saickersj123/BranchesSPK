import axiosInstance from "./axiosInstance";  
import { Message, Conversation } from '../@types/types'; 


// conversationId를 활용해 모든 음성대화 메시지를 가져오는 함수
export const fetchScenarioMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await axiosInstance.get(`/chat/s/${conversationId}`); 
  try {
      //  console.log("받은 fetchVoiceMessages" +JSON.stringify(response.data, null, 2));
      return response.data.conversation.chats || [];
    } catch (error) {
      console.error('메시지 가져오기 실패:', error);
      return [];
    }
  };  

// 모든 시나리오 목록을 가져오는 함수 - 모든 시나리오 목록을 반환하는 함수
export const getAllScenarioList = async (): Promise<any[]> => {  
  try {
    const response = await axiosInstance.get('/chat/scenarios');
    //console.log(" 가지고 온 시나리오 목록 = ", response.data); 
    return response.data.scenarios;
  } catch (error) {
    console.error('시나리오 목록 가져오기 실패:', error);
    throw error;
  } 
  };
  
// 시나리오 기반 대화 시작 API - 시나리오 기반 대화를 시작하는 함수
export const startNewScenarioConversation = async (
  scenarioId: string, 
  selectedRole: 'role1' | 'role2',
  difficulty: number, 
  gameId: string | null
): Promise<string> => { 
  if(gameId === '0'){
    gameId = null;
  } 
  try {
    const response = await axiosInstance.post('/chat/s/new', {
      scenarioId,
      selectedRole, 
      difficulty,
      gameId
    });
    return response.data.conversation._id; // Return the conversation ID
  } catch (error) {
    console.error('시나리오 기반 대화 시작 실패:', error);
    throw error;
  } 
};
 
// 모든 시나리오 컨버세이션을 가지고 오는 함수
export const getAllScenarioConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await axiosInstance.get('/chat/all-s');
    //console.log("api상 대화 아이디 가져오기 응답 : ", response.data);
    return response.data.scenarioConversations.map((conversation: any) => ({
      _id: conversation._id,
      chats: conversation.chats,
      createdAt: conversation.createdAt
    }));
  } catch (error) {
    console.error('대화 목록 가져오기 실패:', error);
    return [];
  }
}; 

 // 음성 메시지 전송 함수
export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob): Promise<{ audioUrl: string; text: string; gptResponse: string; gameResult: any }> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('type', 'scenario'); 
  try {
    const response = await axiosInstance.post(`/chat/c/${conversationId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("음성 메시지 전송 응답 : ", response.data);
    return  { 
      text: response.data.message, // Mock text response
      gptResponse: response.data.gptResponse, // Corrected to use gptResponse
      audioUrl: response.data.gptAudioBuffer, // Mock audio URL 
      gameResult: response.data.gameResult // Mock game result
    }; 
  } catch (error) {
    console.error('Error sending voice message:', error);
    throw error;
  }
};
  
// 대화 삭제 API - 대화를 삭제하는 함수
export const deleteScenarioConversation = async (conversationId: string): Promise<any> => {
  try {
    const response = await axiosInstance.delete(`/chat/s/${conversationId}`);
    return response.status;
  } catch (error) {
    console.error('시나리오 대화 삭제 실패:', error);
    throw error;
  }
};

// 모든 채팅 기록 삭제 API - 모든 채팅 기록을 삭제하는 함수
export const deleteAllScenarioChats = async (): Promise<any> => { 
  try {
    const response = await axiosInstance.delete('/chat/all-s');
    return response.status;
  } catch (error) {
    console.error('모든 시나리오 기록 삭제 실패:', error);
    throw error;
  } 
};


//시나리오의 옵션중 하나인 게임 목록을 가지고 오는 api 함수
export const getGameList = async (): Promise<any[]> => { 
  try {
    const response = await axiosInstance.get('/game/list');
    //console.log(" 가지고 온 게임 목록 = ", response.data);
    return response.data;
  } catch (error) {
    console.error('게임 목록 가져오기 실패:', error);
    throw error;
  } 
};