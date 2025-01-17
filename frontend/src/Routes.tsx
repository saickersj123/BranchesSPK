import React, { useCallback } from 'react';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom'; // Navigate import 추가
import Login from './pages/login/Login';
import MyPage from './pages/MyPage';
import TestChat from './pages/textChat/TestChat';
import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import Scenarios from './pages/Scenarios';
import ServicePage from './pages/servicePage/ServicePage';
import VoiceChat from './pages/voiceChat/VoiceChat';
import LevelProfilePage from './pages/levelProfilePage/levelProfilePage';
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
      <Route path="/levelProfile" element={<LevelProfilePage />} />
      <Route path="/voiceChat" element={<VoiceChat isSidebarOpen={false} />} />
      <Route path="/voiceChat/:conversationId" element={<VoiceChat isSidebarOpen={false} />} />
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
      {/* 추가된 리디렉션 Route */}
      <Route path="*" element={<Navigate to="/" />} />  {/* path="*"를 추가하여 모든 경로를 "/"로 리디렉션 */}
    </ReactRouterRoutes>
  );
};

export default Routes;
