import React, { useState, useEffect , useCallback} from 'react';
import { Container } from 'react-bootstrap';
import VoiceRecorder from '../../components/voiceChat/VoiceRecorder'; 
import { sendVoiceMessage } from '../../api/AiVoiceChat';
import { startNewConversationVoice ,fetchAllConversationIds, fetchVoiceMessages, deleteVoiceConversation, deleteAllVoiceChats } from '../../api/AiVoiceChat';
//import { fetchMessages, fetchConversations, startNewConversation } from '../../api/AiTextChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/voiceChat/VoiceChat.css';
import VoiceChatHeader from './VoiceChatHeader';  
import VoisChatList from '../../components/voiceChat/VoisChatList';  
import NewSidebar from '../../components/Sidebar/NewSidebar';
import ChatResetButton from '../../utils/ChatResetButton';
import { set_routes } from '../../Routes'; 

const VoiceChat: React.FC = ({  }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>(''); 
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>(); 
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams<{ conversationId: string }>();
  const [responseWait, setResponseWait] = useState(false);
  let latestConversationId: string | null = null;
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const fetchedMessages = await fetchVoiceMessages(conversationId);
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
        const conversations = await fetchAllConversationIds();
       //console.log("모든 대화 아이디 가져오기 응답 : ", conversations);
        if (conversations.length > 0) {
          // Sort conversations by createdAt to find the latest one
          const latestConversation = conversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          latestConversationId = latestConversation._id;
         //console.log("가장 최근 대화 아이디 : ", latestConversationId);
          await loadMessages(latestConversationId);
          setSelectedConversationId(latestConversationId); 
          navigate(`${set_routes.VOICE_CHAT}/${latestConversationId}`);
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
          const conversations = await fetchAllConversationIds();
          if (conversations.length > 0) {
            const lastConversation = conversations[conversations.length - 1];
            setConversationId(lastConversation._id);
            navigate(`${set_routes.VOICE_CHAT}/${lastConversation._id}`, { replace: true });
          } else {
            // 기존 대화가 없을 때만 새 대화 시작
            const newConvId = await startNewConversationVoice();
            setConversationId(newConvId);
            navigate(`${set_routes.VOICE_CHAT}/${newConvId}`, { replace: true });
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
      setResponseWait(true); // Set responseWait to true when sending a message
      const response = await sendVoiceMessage(conversationId, audioBlob);
      const newMessage: Message = { 
        role: 'user',
        content: response.text, 
        audioUrl: '', 
        createdAt: new Date().toISOString(),
        gameResult: null,
      };
      setMessages((prev) => [...prev, newMessage]); 
      
      const aiMessage: Message = { 
        role: 'assistant',
        content: response.gptResponse,
        audioUrl: response.audioUrl, 
        createdAt: new Date().toISOString(),
        gameResult: null,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 음성 파일 자동 재생
      const audio = new Audio(response.audioUrl);
      audio.play();
      
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    } finally {
      setResponseWait(false); // Reset responseWait to false after message is sent
    }
  };

  const handleReset = async () => {
    try {
      if (latestConversationId) {
        await deleteVoiceConversation(latestConversationId);
       //console.log(`Conversation ${latestConversationId} deleted successfully.`);
      } else {
        throw new Error('No latest conversation ID available.');
      }
    } catch (error) {
      console.error('Failed to delete specific conversation, attempting to delete all:', error);
      try {
        await deleteAllVoiceChats();
       //console.log('All voice chats deleted successfully.');
      } catch (allDeleteError) {
        console.error('Failed to delete all voice chats:', allDeleteError);
      }
    }

    try {
      const newConversationId = await startNewConversationVoice();
     //console.log('New conversation started with ID:', newConversationId);
      navigate(`${set_routes.VOICE_CHAT}/${newConversationId}`, { replace: true });
    } catch (newConvError) {
      console.error('Failed to start a new conversation:', newConvError);
    }
  };

  return (
    <Container>  
      <VoiceChatHeader 
        isSidebarOpen={sidebarOpen} 
        setIsSidebarOpen={setSidebarOpen}
        onReset={handleReset}
      >
        <div className={`voice-chat-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="voice-chat-content-container">

            <div className="voice-messages-container">
              <VoisChatList messages={messages} />
            </div>

            <div className="voice-recorder-container">   
              <VoiceRecorder 
               onSend={handleVoiceSend} 
               responseWait={responseWait}  
              /> 
            </div>
            
          </div>
        </div>
      </VoiceChatHeader>
      <NewSidebar
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatResetButton onClick={handleReset} OriginUrl={set_routes.VOICE_CHAT}/>
    </Container>
  );
};

export default VoiceChat;
