import React, { useCallback } from 'react';
import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';
import Login from './pages/login/Login';
import MyPage from './pages/MyPage';
import TestChat from './pages/textChat/TestChat';
import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import Scenarios from './pages/Scenarios';
import ServicePage from './pages/servicePage/ServicePage';
import VoiceChat from './pages/voiceChat/VoiceChat';
import { fetchMessages } from './api/AiTextChat';
import { Message, User } from './@types/types';

interface RoutesProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLayoutEditing: boolean;
  toggleLayoutEditing: () => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  nicknameChanged: boolean;
  setNicknameChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const Routes: React.FC<RoutesProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,
  isLayoutEditing,
  toggleLayoutEditing,
  messages,
  setMessages,
  username,
  setUsername,
  nicknameChanged,
  setNicknameChanged,
}) => {
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [setMessages]);

  return (
    <ReactRouterRoutes> 
      <Route path="/" element={<MainPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
      <Route path="/scenarios" element={<Scenarios />} />
      <Route path="/mypage" element={<MyPage user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername} setNicknameChanged={setNicknameChanged} />} />
      <Route path="/textChat" element={
        <TestChat
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          isLayoutEditing={isLayoutEditing}
          loadMessages={loadMessages}
          messages={messages}
          setMessages={setMessages}
          toggleLayoutEditing={toggleLayoutEditing}
          username={username}
          setUsername={setUsername}
          nicknameChanged={nicknameChanged}
          setNicknameChanged={setNicknameChanged}
        />
      } />
      <Route path="/textChat/:conversationId" element={
        <TestChat
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          isLayoutEditing={isLayoutEditing}
          loadMessages={loadMessages}
          messages={messages}
          setMessages={setMessages}
          toggleLayoutEditing={toggleLayoutEditing}
          username={username}
          setUsername={setUsername}
          nicknameChanged={nicknameChanged}
          setNicknameChanged={setNicknameChanged}
        />
      } />
      <Route path="/voiceChat" element={<VoiceChat />} />  
    </ReactRouterRoutes>
  );
};

export default Routes;