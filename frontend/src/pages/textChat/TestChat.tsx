import React, { useState, useEffect , useCallback} from 'react';
import { Container } from 'react-bootstrap';
import TextChatBox from '../../components/textChat/TextChatBox';  
import { sendMessage, startNewConversation ,fetchConversations, fetchMessages, deleteConversation, deleteAllChats } from '../../api/AiTextChat';
import { Message } from '../../@types/types';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/textChat/TextChat.css';
import TextChatHeader from './TextChatHeader';  
import TextChatList from '../../components/textChat/TextChatList';  
import NewSidebar from '../../components/newSidebar/NewSIdebar';
import ChatResetButton from '../../utils/ChatResetButton';
import { set_routes } from '../../Routes'; 

const textChat: React.FC = () => {
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
      const fetchedMessages = await fetchMessages(conversationId);
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
        const conversations = await fetchConversations();
       //console.log("모든 대화 아이디 가져오기 응답 : ", conversations);
        if (conversations.length > 0) {
          // Sort conversations by createdAt to find the latest one
          const latestConversation = conversations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
          latestConversationId = latestConversation._id;
         //console.log("가장 최근 대화 아이디 : ", latestConversationId);
          await loadMessages(latestConversationId);
          setSelectedConversationId(latestConversationId); 
          navigate(`${set_routes.TEXT_CHAT}/${latestConversationId}`);
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
          const conversations = await fetchConversations();
          if (conversations.length > 0) {
            const lastConversation = conversations[conversations.length - 1];
            setConversationId(lastConversation._id);
            navigate(`${set_routes.TEXT_CHAT}/${lastConversation._id}`, { replace: true });
          } else {
            // 기존 대화가 없을 때만 새 대화 시작
            const newConvId = await startNewConversation();
            setConversationId(newConvId);
            navigate(`${set_routes.TEXT_CHAT}/${newConvId}`, { replace: true });
          }
        } catch (error: any) {
          console.error('대화 초기화 실패:', error);
          // 에러 메시지가 있다면 사용자에게 표시할 수 있습니다 
        }
      }
    };

    initializeConv();
  }, [routeConversationId, navigate]);

  const handleTextSend = async (messageContent: string) => { 
    try {
      setResponseWait(true); // Set responseWait to true when sending a message
      const response = await sendMessage(conversationId, messageContent);
      console.log("메시지 보내기 응답 :", JSON.stringify(response, null, 2)); // Log the entire response

      const newMessage: Message = { 
        role: 'user',
        content: messageContent, 
        audioUrl: '', 
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]); 

      // Find the latest assistant's message in the response
      const aiResponses = response.filter(msg => msg.role === 'assistant');
      if (aiResponses.length > 0) {
        const latestAiResponse = aiResponses[aiResponses.length - 1]; // Get the latest assistant message
        const aiMessage: Message = { 
          role: 'assistant',
          content: latestAiResponse.content, // Use the content from the latest response
          audioUrl: '', 
          createdAt: latestAiResponse.createdAt, // Use the createdAt from the response
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.warn('No assistant message found in response');
      }
    } catch (error) {
      console.error('음성 메시지 전송 실패:', error);
    } finally {
      setResponseWait(false); // Reset responseWait to false after message is sent
    }
  };

  const handleReset = async () => {
    try {
      if (latestConversationId) {
        await deleteConversation(latestConversationId);
       //console.log(`Conversation ${latestConversationId} deleted successfully.`);
      } else {
        throw new Error('No latest conversation ID available.');
      }
    } catch (error) {
      console.error('Failed to delete specific conversation, attempting to delete all:', error);
      try {
        await deleteAllChats();
       //console.log('All text chats deleted successfully.');
      } catch (allDeleteError) {
        console.error('Failed to delete all text chats:', allDeleteError);
      }
    }

    try {
      const newConversationId = await startNewConversation();
     //console.log('New conversation started with ID:', newConversationId);
      navigate(`${set_routes.TEXT_CHAT}/${newConversationId}`, { replace: true });
    } catch (newConvError) {
      console.error('Failed to start a new conversation:', newConvError);
    }
  };

  return (
    <Container>  
      <TextChatHeader 
        isSidebarOpen={sidebarOpen}   
        setIsSidebarOpen={setSidebarOpen}
        onReset={handleReset}
      >
        <div className={`text-chat-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="text-chat-content-container">
            <div className="text-messages-container">
              <TextChatList messages={messages} />
            </div>
            <div className="text-chat-input-container-main">
              <TextChatBox onSend={handleTextSend} responseWait={responseWait} />  
            </div>
          </div>
        </div>
      </TextChatHeader>
      <NewSidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ChatResetButton onClick={handleReset} OriginUrl={set_routes.TEXT_CHAT}/>
    </Container>
  );
};

export default textChat;
