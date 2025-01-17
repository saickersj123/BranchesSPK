import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import VoiceRecorder from '../../components/voiceChat/VoiceRecorder'; 
import { sendVoiceMessage, startNewConversationVoice } from '../../api/AiVoiceChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/voiceChat/VoiceChat.css';
import VoiceChatHeader from './VoiceChatHeader';  
import VoisChatList from '../../components/voiceChat/VoisChatList'; 
import Sidebar from '../../components/sidebar/Sidebar'; 

interface VoiceChatProps {
  isSidebarOpen: boolean;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ isSidebarOpen }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [isNewConversation, setIsNewConversation] = useState<boolean>(true);
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    const initializeConv = async () => {
      if (routeConversationId) {
        setConversationId(routeConversationId);
        setIsNewConversation(false);
      } else {
        try {
          const newConvId = await startNewConversationVoice();
          setConversationId(newConvId);
          setIsNewConversation(false);
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
        role: 'ai',
        content: response.gptResponse,
        audioUrl: response.audioUrl, 
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    }
  };

  return (
    <Container className="voice-chat-container">
      <div className='voiceChatSidebar'> 
        {/* 여기에 사이드바를 넣을 예정임. */}
      </div>
      <div className="voice-chat-header-container">
        <VoiceChatHeader isSidebarOpen={isSidebarOpen} />  
      </div>
      <div className="voice-chat-content-container">
        <div className="messages-container">
          <VoisChatList messages={messages} />
        </div> 
         <VoiceRecorder onSend={handleVoiceSend} />  
      </div>
    </Container>
  );
};

export default VoiceChat;
