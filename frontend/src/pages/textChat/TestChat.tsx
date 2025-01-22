import React, { useState, useEffect, useCallback, useRef } from 'react';  
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ChatBox from '../../components/testChat/ChatBox';
import ChatList from '../../components/testChat/ChatList';
import NewSidebar from '../../components/newSidebar/NewSidebar'; 
import useLogout from '../../utils/Logout'; 
import { fetchMessages, fetchConversations, startNewConversation, deleteConversation, deleteAllChats } from '../../api/AiTextChat'; 
import '../../css/textChat/TextChat.css';
import LoginModal from '../../components/login/LoginModal';
import { loadSidebarState } from '../../utils/sidebarUtils';
import { Message, Conversation } from '../../@types/types';  
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown';
import ChatResetButton from '../../utils/ChatResetButton';

interface HomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: { name: string } | null;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  nicknameChanged: boolean;
  setNicknameChanged: React.Dispatch<React.SetStateAction<boolean>>;
  loadMessages: (conversationId: string) => Promise<void>;
}

const DEFAULT_MODEL = "gpt-3.5-turbo";

const Home: React.FC<HomeProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  username,
  setUsername,
  nicknameChanged,
  setNicknameChanged
}) => {
  const handleLogout = useLogout();
  const sidebarRef = useRef<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isNewChat, setIsNewChat] = useState<boolean>(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationId: urlConversationId } = useParams<{ conversationId: string }>(); 
  const [myChatBubbleColor, setMyChatBubbleColor] = useState<string>('#DCF8C6');
  const [myChatTextColor, setMyChatTextColor] = useState<string>('#000000');
  const [otherChatBubbleColor, setOtherChatBubbleColor] = useState<string>('#F0F0F0');
  const [otherChatTextColor, setOtherChatTextColor] = useState<string>('#000000');
  const [chatBubbleBold, setChatBubbleBold] = useState<boolean>(false);
  const [chatBubbleShadow, setChatBubbleShadow] = useState<boolean>(false);
  const [chatContainerBgColor, setChatContainerBgColor] = useState<string>('#FFFFFF'); 
  const [previousSidebarState, setPreviousSidebarState] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isCreatingConversationRef = useRef<boolean>(false);
  let latestConversationId: string;

  const loadMessages = useCallback(async (conversationId: string) => { 
    try {
      const fetchedMessages = await fetchMessages(conversationId);
      if (fetchedMessages.length > 0) {
        setMessages(fetchedMessages);
        setIsNewChat(false);
      } else {
        console.warn(`No messages found for conversation ${conversationId}`);
        setIsNewChat(true);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const loadConversationMessages = async () => { 
      if (urlConversationId) {  
        try {
          await loadMessages(urlConversationId);  
          setSelectedConversationId(urlConversationId);
          setIsNewChat(false);
        } catch (error) {
          console.error('Error loading conversation messages:', error);
          // 에러 처리 (예: 사용자에게 알림)
        }
        return;
      }  
    };

    loadConversationMessages();
  }, [urlConversationId, loadMessages, navigate]);

  useEffect(() => {
    document.documentElement.style.setProperty('--my-chat-bubble-color', myChatBubbleColor);
    document.documentElement.style.setProperty('--my-chat-text-color', myChatTextColor);
    document.documentElement.style.setProperty('--other-chat-bubble-color', otherChatBubbleColor);
    document.documentElement.style.setProperty('--other-chat-text-color', otherChatTextColor);
    document.documentElement.style.setProperty('--chat-bubble-bold', chatBubbleBold ? 'bold' : 'normal');
    document.documentElement.style.setProperty('--chat-bubble-shadow', chatBubbleShadow ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none');
    document.documentElement.style.setProperty('--chat-container-bg-color', chatContainerBgColor);
  }, [myChatBubbleColor, myChatTextColor, otherChatBubbleColor, otherChatTextColor, chatBubbleBold, chatBubbleShadow, chatContainerBgColor]);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const fetchedConversations = await fetchConversations();
        setConversations(fetchedConversations); 
        if (fetchedConversations.length === 0) {
          setIsNewChat(true);
          if (!selectedConversationId && !isCreatingConversationRef.current) {
            isCreatingConversationRef.current = true;
            await handleStartConversation();
            isCreatingConversationRef.current = false;
          }
        } else if (fetchedConversations.length > 0 && !urlConversationId) {
          setSelectedConversationId(fetchedConversations[fetchedConversations.length-1]._id);
          navigate(`/textChat/${fetchedConversations[fetchedConversations.length-1]._id}`);
        }
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      }
    };
    if (isLoggedIn) {
      loadConversations();
    }
  }, [isLoggedIn, navigate, urlConversationId, selectedConversationId]);

  useEffect(() => {
    const loadStyleSettings = () => {
      const settings = {
        myChatBubbleColor: localStorage.getItem('myChatBubbleColor'),
        myChatTextColor: localStorage.getItem('myChatTextColor'),
        otherChatBubbleColor: localStorage.getItem('otherChatBubbleColor'),
        otherChatTextColor: localStorage.getItem('otherChatTextColor'),
        chatContainerBgColor: localStorage.getItem('chatContainerBgColor'),
        chatBubbleBold: JSON.parse(localStorage.getItem('chatBubbleBold') || 'false'),
        chatBubbleShadow: JSON.parse(localStorage.getItem('chatBubbleShadow') || 'false'),
      };

      if (settings.myChatBubbleColor) setMyChatBubbleColor(settings.myChatBubbleColor);
      if (settings.myChatTextColor) setMyChatTextColor(settings.myChatTextColor);
      if (settings.otherChatBubbleColor) setOtherChatBubbleColor(settings.otherChatBubbleColor);
      if (settings.otherChatTextColor) setOtherChatTextColor(settings.otherChatTextColor);
      if (settings.chatContainerBgColor) setChatContainerBgColor(settings.chatContainerBgColor);
      setChatBubbleBold(settings.chatBubbleBold);
      setChatBubbleShadow(settings.chatBubbleShadow);
    };

    if (nicknameChanged) {
      setUsername(username);
      setNicknameChanged(false);
    } else if (user) {
      setUsername(user.name);
    }

    loadStyleSettings();
  }, [user, setUsername, nicknameChanged, setNicknameChanged, username]);

  useEffect(() => {
    if (isLoggedIn) {
      const initialSidebarState = loadSidebarState();
      setIsSidebarOpen(initialSidebarState);
    }
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate('/login');
  }; 
  
  const handleChatInputAttempt = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    }
  };

  const handleNewMessage = useCallback((newMessage: Message) => {
    console.log('handleNewMessage 호출됨, 새 메시지:', newMessage);
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      console.log('업데이트된 메시지 목록:', updatedMessages);
      setTimeout(() => {
        const chatListContainer = document.querySelector('.chat-list-container');
        if (chatListContainer) {
          chatListContainer.scrollTop = chatListContainer.scrollHeight;
        }
      }, 0);
      return updatedMessages;
    });
    updateConversations();
  }, []);

  const handleUpdateMessage = useCallback((aiMessage: Message) => {
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, aiMessage];
      setTimeout(() => {
        const chatListContainer = document.querySelector('.chat-list-container');
        if (chatListContainer) {
          chatListContainer.scrollTop = chatListContainer.scrollHeight;
        }
      }, 0);
      return updatedMessages;
    });
    updateConversations();
  }, []);

  const updateConversations = async () => {
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations as Conversation[]);
    } catch (error) {
      console.error('Failed to update conversations:', error);
    }
  };

  const handleStartConversation = async () => { 
    setIsLoading(true);
    try {
      const newConversationId = await startNewConversation();
      setSelectedConversationId(newConversationId);
      setIsNewChat(false);
      setMessages([]);
      navigate(`/textChat/${newConversationId}`, { replace: true });
    } catch (error) { 
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
    }
    setIsLoading(false);
  };

  const handleResetConversation = async () => {
    setIsLoading(true);
    if (selectedConversationId) {
      try {
        await deleteConversation(selectedConversationId);   
      } catch (error) {
        await deleteAllChats();
      }
    } else {
      await deleteAllChats();
    }
    try {
      const newConversationId = await startNewConversation();
      setSelectedConversationId(newConversationId);
      setIsNewChat(false);
      setMessages([]);
      navigate(`/textChat/${newConversationId}`, { replace: true });
    } catch (error) { 
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations);
    }
    setIsLoading(false);
  }; 
 

  return (
    <main className={`main-section`}>
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        isLoggedIn ? (
          <>
            <div className={`home-header-container ${isSidebarOpen ? 'shifted-header' : ''}`}>
              <div className="header-left-section"> 
                <span className="brand-text-chat" onClick={() => navigate('/textChat')}>Branch-SPK</span>
              </div>
              <UserSetDropdown currentPage="/textChat" />
            </div>
            
            <NewSidebar 
              isOpen={isSidebarOpen} 
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            
            <div className={`main-content ${isSidebarOpen ? 'shifted-right' : ''}`}>
              <div className="chat-container">
                <div className="chat-list-container">
                  {isNewChat ? (
                    <div className="alert alert-info text-center">
                      새로운 대화를 시작해 보세요!
                    </div>
                  ) : (
                    <ChatList
                      messages={messages}
                      username={username}
                      showTime={true}
                    />
                  )}
                </div>
                <ChatBox 
                  onNewMessage={handleNewMessage}
                  onUpdateMessage={handleUpdateMessage}
                  conversationId={selectedConversationId}
                  isNewChat={isNewChat}
                  onChatInputAttempt={handleChatInputAttempt}
                  isLoggedIn={isLoggedIn}
                  selectedModel={selectedModel}
                  onNewConversation={handleResetConversation} 
                  setSelectedConversationId={setSelectedConversationId}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="home-login-container">
            <button className="home-login-button" onClick={handleLoginClick}>로그인</button>
          </div>
        )
      )}
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        handleLogin={handleLoginClick}
      />
      <ChatResetButton onClick={handleResetConversation} />
    </main>
  );
};

export default Home;
