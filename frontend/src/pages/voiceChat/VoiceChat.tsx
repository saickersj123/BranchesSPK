import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import VoiceRecorder from '../../components/voiceChat/VoiceRecorder'; 
import { sendVoiceMessage, startNewConversationVoice } from '../../api/AiVoiceChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/voiceChat/VoiceChat.css';
import VoiceChatHeader from './VoiceChatHeader';

const VoiceChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [isNewConversation, setIsNewConversation] = useState<boolean>(true);
  const navigate = useNavigate();
  const { conversationId: routeConversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    // 대화 ID가 URL에 있는 경우 해당 ID 사용, 없으면 새로 초기화
    const initializeConv = async () => {
      if (routeConversationId) {
        setConversationId(routeConversationId);
        setIsNewConversation(false);
      } else {
        try {
          const newConvId = await startNewConversationVoice(); // 대화 초기화 함수 호출
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
        content: '음성 메시지 전송됨', // 실제 응답 텍스트로 대체
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      
      // 서버에서 응답받은 메시지를 처리 (예: AI의 응답)
      const aiMessage: Message = { 
        role: 'ai',
        content: response.text,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    }
  };

  return (
    <Container className="voice-chat-container">
      <div className="voice-chat-header-container">
        <VoiceChatHeader />  
      </div>
      <div className="voice-chat-content-container">
        <div className="messages-container">
          {messages.map((msg) => (
            <div className={`message ${msg.role}`}>
              <span>{msg.content}</span> 
            </div>
          ))}
        </div>
        <VoiceRecorder onSend={handleVoiceSend} /> 
      </div>
    </Container>
  );
};

export default VoiceChat;