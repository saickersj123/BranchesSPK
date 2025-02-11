import React, { useState, useEffect , useCallback} from 'react';
import { Container } from 'react-bootstrap'; 
import { getAllScenarioConversations, fetchScenarioMessages, 
        sendVoiceMessage, deleteScenarioConversation, 
        deleteAllScenarioChats } from '../../api/AiScenariosChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/scenarioPage/ScenarioChat.css';
import ScenarioHeader from './ScenarioHeader';  
import ScenariosRecorder from '../../components/scenariosPage/ScenariosRecorder';
import ScenariosChatList from '../../components/scenariosPage/ScenariosChatList';  
import NewSidebar from '../../components/newSidebar/NewSidebar';
import ChatResetButton from '../../utils/ChatResetButton';
import { set_routes } from '../../Routes';  

const ScenarioChat: React.FC = ({  }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>(''); 
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>(); 
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams<{ conversationId: string }>();
  const [responseWait, setResponseWait] = useState(false); 
  let originUrl = set_routes.SCENARIO_LIST;

  let latestConversationId: string | null = null;
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const fetchedMessages = await fetchScenarioMessages(conversationId);
      if (fetchedMessages.length > 0) {
        //console.log("fetchedMessages :", JSON.stringify(fetchedMessages, null, 2)); // 객체를 문자열로 변환하여 출력
        setMessages(fetchedMessages);  
      } else {
        console.warn(`No messages found for conversation ${conversationId}`); 
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  }, []);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (urlConversationId) {
        try {
          await loadMessages(urlConversationId);
          setSelectedConversationId(urlConversationId); 
        } catch (error) {
          console.error('Error loading conversation messages:', error);
        }
      } else {
        const conversations = await getAllScenarioConversations();
       //console.log("모든 대화 아이디 가져오기 응답 : ", conversations);
        if (conversations.length > 0) {
          // Sort conversations by createdAt to find the latest one
          const latestConversation = conversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          latestConversationId = latestConversation._id;
         //console.log("가장 최근 대화 아이디 : ", latestConversationId);
          await loadMessages(latestConversationId);
          setSelectedConversationId(latestConversationId); 
          navigate(`${set_routes.SCENARIO_CHAT}/${latestConversationId}`);
        } else { 
          setMessages([]);
        }
      }
    };

    loadConversationMessages();
  }, [urlConversationId, loadMessages, navigate]);

  useEffect(() => {
    const initializeConv = async () => {
      if (routeConversationId) {
        setConversationId(routeConversationId); 
      } else {
        try {
          // 기존 대화가 있는지 먼저 확인
          const conversations = await getAllScenarioConversations();
          if (conversations.length > 0) {
            const lastConversation = conversations[conversations.length - 1];
            setConversationId(lastConversation._id);
            navigate(`${set_routes.SCENARIO_CHAT}/${lastConversation._id}`, { replace: true });
          } 
        } catch (error: any) {
          console.error('대화 초기화 실패:', error);
          // 에러 메시지가 있다면 사용자에게 표시할 수 있습니다 
        }
      }
    };

    initializeConv();
  }, [routeConversationId, navigate]);

  const handleVoiceSend = async (audioBlob: Blob) => { 
    try {
      setResponseWait(true);
      const response = await sendVoiceMessage(conversationId, audioBlob); 
      let gameResult = true;
      if(response.gameResult) {
        gameResult = true;
      }
      if (response && response.text) {
        const newMessage: Message = { 
          role: 'user',
          content: response.text, 
          audioUrl: '', 
          createdAt: new Date().toISOString(), 
          gameResult: gameResult,
        };
        setMessages((prev) => [...prev, newMessage]); 
        
        const aiMessage: Message = { 
          role: 'assistant',
          content: response.gptResponse,
          audioUrl: response.audioUrl, 
          createdAt: new Date().toISOString(),
          gameResult: "",
        };
        setMessages((prev) => [...prev, aiMessage]); 
        console.log("게임 결과 : ", gameResult);
        const audio = new Audio(response.audioUrl);
        audio.play();
      } else {
        console.error('Invalid response received:', response);
      }
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    } finally {
      setResponseWait(false);
    }
  };

  const handleReset = async () => {
    try {
      if (latestConversationId) {
        await deleteScenarioConversation(latestConversationId); 
      } else {
        throw new Error('No latest conversation ID available.');
      }
    } catch (error) {
      console.error('Failed to delete specific conversation, attempting to delete all:', error);
      try {
        await deleteAllScenarioChats(); 
      } catch (allDeleteError) {
        console.error('Failed to delete all voice chats:', allDeleteError);
      }
    }
    navigate(`${set_routes.SCENARIO_LIST}`);
  };

  return (
    <Container>  
      <ScenarioHeader 
        isSidebarOpen={sidebarOpen} 
        setIsSidebarOpen={setSidebarOpen}
        onReset={handleReset}
      >
        <div className={`scenarios-chat-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="scenarios-chat-content-container">
            <div className="scenarios-messages-container">
              <ScenariosChatList messages={messages} />
            </div> 
            <div className="scenarios-recorder-container">
              <ScenariosRecorder 
              onSend={handleVoiceSend} 
              responseWait={responseWait} />  
            </div>
          </div>
        </div>
      </ScenarioHeader>
      <NewSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      /> 
      <ChatResetButton onClick={handleReset} OriginUrl={set_routes.SCENARIO_LIST} />
    </Container>
  );
};

export default ScenarioChat;
