import React, { useState, useEffect, useCallback, useRef } from 'react';  
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ChatBox from '../../components/testChat/ChatBox';
import ChatList from '../../components/testChat/ChatList';
import NewSidebar from '../../components/newSidebar/NewSidebar';
import GridLayout from 'react-grid-layout'; 
import useLogout from '../../utils/Logout'; 
import { fetchMessages, fetchConversations, startNewConversation } from '../../api/AiTextChat'; 
import '../../css/TextChat.css';
import LoginModal from '../../components/login/LoginModal';
import { saveSidebarState, loadSidebarState } from '../../utils/sidebarUtils';
import { Message, Conversation } from '../../@types/types'; 
import { IoRefreshOutline } from 'react-icons/io5';
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown';

interface HomeProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: { name: string } | null;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  nicknameChanged: boolean;
  setNicknameChanged: React.Dispatch<React.SetStateAction<boolean>>;
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
      } else {
        // URL에 대화 ID가 없는 경우, 가장 최근 대화를 로드하거나 새 대화 시작
        const conversations = await fetchConversations();
        if (conversations.length > 0) {
          const latestConversationId = conversations[conversations.length - 1]._id;
          await loadMessages(latestConversationId);
          setSelectedConversationId(latestConversationId);
          setIsNewChat(false);
          navigate(`/textchat/${latestConversationId}`);
        } else {
          setIsNewChat(true);
          setMessages([]);
        }
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
  }, [isLoggedIn, navigate, urlConversationId]);

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

  const handleProfileClick = async () => {
    navigate("/mypage", { state: { from: '/textChat' } });
  }; 

  const handlelevelProfileClick = async () => {
    navigate("/levelProfile", { state: { from: '/textChat' } });
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

  const handleConversationSelect = async (conversationId: string) => {
    try {
      await loadMessages(conversationId);
      setSelectedConversationId(conversationId);
      setIsNewChat(false);
      navigate(`/textChat/${conversationId}`);
    } catch (error) {
      console.error('Failed to load conversation messages:', error);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const updateConversations = async () => {
    try {
      const fetchedConversations = await fetchConversations();
      setConversations(fetchedConversations as Conversation[]);
    } catch (error) {
      console.error('Failed to update conversations:', error);
    }
  };

  const handleStartConversation = async () => {
    const newConversationId = await startNewConversation();
    handleConversationSelect(newConversationId);
  };

  const handleNewConversation = async () => {
    try {
      const newConversationId = await startNewConversation();
      setSelectedConversationId(newConversationId);
      setIsNewChat(false);
      setMessages([]);
      navigate(`/textChat/${newConversationId}`);
    } catch (error) {
      console.error('Failed to start new conversation:', error);
    }
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    saveSidebarState(newState);
  };
 
  return (
    <main className={`main-section`}>
      {isLoggedIn ? (
        <>
          <div className={`home-header-container ${isSidebarOpen ? 'shifted-header' : ''}`}>
            <div className="header-left-section">
              <span className="home_new_conversation" onClick={handleStartConversation}>
                <IoRefreshOutline />
              </span>
              <span className="brand-text" onClick={() => navigate('/textChat')}>Branch-SPK</span>
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
                onNewConversation={handleNewConversation} 
                setSelectedConversationId={setSelectedConversationId}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="home-login-container">
          <button className="home-login-button" onClick={handleLoginClick}>로그인</button>
        </div>
      )}
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
        handleLogin={handleLoginClick}
      />
    </main>
  );
};

export default Home;
