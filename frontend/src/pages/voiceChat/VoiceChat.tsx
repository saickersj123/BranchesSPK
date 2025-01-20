import React, { useState, useEffect , useCallback} from 'react';
import { Container } from 'react-bootstrap';
import VoiceRecorder from '../../components/voiceChat/VoiceRecorder'; 
import { sendVoiceMessage } from '../../api/AiVoiceChat';
import { fetchMessages, fetchConversations, startNewConversation } from '../../api/AiTextChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/voiceChat/VoiceChat.css';
import VoiceChatHeader from './VoiceChatHeader';  
import VoisChatList from '../../components/voiceChat/VoisChatList';  
import NewSidebar from '../../components/newSIdebar/NewSIdevar';
interface VoiceChatProps {
  isSidebarOpen: boolean;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ isSidebarOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>(''); 
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>(); 
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams<{ conversationId: string }>();
  
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      if (fetchedMessages.length > 0) {
        //console.log("fetchedMessages : " + fetchedMessages);
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
          //console.log("urlConversationId : " + urlConversationId);
          setSelectedConversationId(urlConversationId); 
        } catch (error) {
          console.error('Error loading conversation messages:', error);
          // 에러 처리 (예: 사용자에게 알림)
        }
      } else {
        // URL에 대화 ID가 없는 경우, 가장 최근 대화를 로드하거나 새 대화 시작
        const conversations = await fetchConversations();
        if (conversations.length > 0) {
          const latestConversationId = conversations[conversations.length - 1]._id;
          await loadMessages(latestConversationId);
          setSelectedConversationId(latestConversationId); 
          navigate(`/voiceChat/${latestConversationId}`);
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
          const newConvId = await startNewConversation();
          setConversationId(newConvId); 
          navigate(`/voiceChat/${newConvId}`, { replace: true });
        } catch (error) {
          console.error('대화 초기화 실패:', error);
        }
      }
    };

    initializeConv();
  }, [routeConversationId, navigate]);

  const handleVoiceSend = async (audioBlob: Blob) => {
    if (!conversationId) {
      console.error('대화 ID가 없습니다.');
      return;
    }

    try {
      const response = await sendVoiceMessage(conversationId, audioBlob);
      const newMessage: Message = { 
        role: 'user',
        content: response.text, 
        audioUrl: '', 
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]); 
      
      const aiMessage: Message = { 
        role: 'assistant',
        content: response.gptResponse,
        audioUrl: response.audioUrl, 
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // 음성 파일 자동 재생
      const audio = new Audio(response.audioUrl);
      audio.play();
      
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    }
  };

  return (
    <Container>  
      <VoiceChatHeader 
        isSidebarOpen={sidebarOpen} 
        setIsSidebarOpen={setSidebarOpen}
      >
        <div className={`voice-chat-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="voice-chat-content-container">
            <div className="messages-container">
              <VoisChatList messages={messages} />
            </div> 
            <VoiceRecorder onSend={handleVoiceSend} />  
          </div>
        </div>
      </VoiceChatHeader>
      <NewSidebar isOpen={sidebarOpen} />
    </Container>
  );
};

export default VoiceChat;
