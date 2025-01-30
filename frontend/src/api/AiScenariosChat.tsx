import axiosInstance, { TEST_MODE } from "./axiosInstance";
import { AIScenario } from "../@types/scenarios";
import { DUMMY_SCENARIOS } from "../data/dummy_scenarios_types"; 
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
    if (TEST_MODE) {
      // 더미 데이터 모드
      return Promise.resolve(DUMMY_SCENARIOS); // DUMMY_SCENARIOS는 types.ts에서 import
    } else {
      // 실제 서버 통신 모드
      try {
        const response = await axiosInstance.get('/chat/scenarios');
        //console.log(" 가지고 온 시나리오 목록 = ", response.data); 
        return response.data.scenarios;
      } catch (error) {
        console.error('시나리오 목록 가져오기 실패:', error);
        throw error;
      }
    }
  };
  
// 시나리오 기반 대화 시작 API - 시나리오 기반 대화를 시작하는 함수
export const startNewScenarioConversation = async (
  scenarioId: string, 
  selectedRole: 'role1' | 'role2',
  game_id: string,
  difficulty: number 
): Promise<string> => {
  if (TEST_MODE) { 
    const selectedScenario = DUMMY_SCENARIOS.find(s => s._id === scenarioId);
    if (!selectedScenario) {
      throw new Error('선택된 시나리오를 찾을 수 없습니다.');
    } else {
      // Return a mock conversation ID
      return 'mock_id';
    }
  } else {
    // 실제 서버 통신 모드
    try {
      const response = await axiosInstance.post('/chat/s/new', {
        scenarioId,
        selectedRole, 
        difficulty
      });
      return response.data.conversation._id; // Return the conversation ID
    } catch (error) {
      console.error('시나리오 기반 대화 시작 실패:', error);
      throw error;
    }
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
export const sendVoiceMessage = async (conversationId: string, audioBlob: Blob): Promise<{ audioUrl: string; text: string; gptResponse: string }> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('type', 'scenario');
  

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
  if(TEST_MODE) {
    return Promise.resolve([
      { id: '11111', name: '키워드 맞추기' },
      { id: '222222', name: '문제 맞추기' },
      { id: '3333333', name: '문법 맞추기' }
    ]);
  }
  else {
    try {
      const response = await axiosInstance.get('/game/list');
      console.log(" 가지고 온 게임 목록 = ", response.data);
      return response.data;
    } catch (error) {
      console.error('게임 목록 가져오기 실패:', error);
      throw error;
    }
  }
};