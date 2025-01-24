import React, { useCallback } from 'react';
import { Route, Routes as ReactRouterRoutes, Navigate } from 'react-router-dom'; // Navigate import 추가
import Login from './pages/login/Login';
import MyPage from './pages/MyPage';
import TestChat from './pages/textChat/TestChat';
import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import ScenarioList from './pages/scenarioPage/ScenarioList';
import ServicePage from './pages/servicePage/ServicePage';
import VoiceChat from './pages/voiceChat/VoiceChat';
import LevelProfilePage from './pages/levelProfilePage/levelProfilePage';
import { fetchMessages } from './api/AiTextChat';
import { Message, User } from './@types/types'; 
import ScenarioChat from './pages/scenarioPage/ScenarioChat';



interface RoutesProps {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>; 
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;    
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>; 
}
 
export const set_routes = {
  SCENARIO_LIST: '/scenariolist',
  SCENARIO_CHAT: '/scenarioChat',

  VOICE_CHAT: '/voiceChat',
  TEXT_CHAT: '/textChat',
  
  LANDING_PAGE: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SERVICE_PAGE: '/service',
  MY_PAGE: '/mypage', 
  LEVEL_PROFILE_PAGE: '/levelProfile',
};

const Routes: React.FC<RoutesProps> = ({
  isLoggedIn,
  setIsLoggedIn,
  user,
  setUser,    
  username,
  setUsername, 
}) => { 

  function setNicknameChanged(changed: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <ReactRouterRoutes>
      <Route path="/" element={<MainPage />} />
      <Route path="/service" element={<ServicePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
      <Route path="/scenariolist" element={<ScenarioList page={''} />} />
      <Route path="/scenarioChat" element={<ScenarioChat isSidebarOpen={false} />} />
      <Route path="/scenarioChat/:conversationId" element={<ScenarioChat isSidebarOpen={false} />} />
      <Route path="/mypage" element={<MyPage user={user} setUser={setUser} setIsLoggedIn={setIsLoggedIn} username={username} setUsername={setUsername} setNicknameChanged={setNicknameChanged} />} />
      <Route path="/levelProfile" element={<LevelProfilePage />} />
      <Route path="/voiceChat" element={<VoiceChat isSidebarOpen={false} />} />
      <Route path="/voiceChat/:conversationId" element={<VoiceChat isSidebarOpen={false} />} />
      <Route path="/textChat" element={<TestChat/> } />
      <Route path="/textChat/:conversationId" element={<TestChat/> } /> 
      <Route path="*" element={<Navigate to={set_routes.LANDING_PAGE} />} />  {/* path="*"를 추가하여 모든 경로를 "/"로 리디렉션 */}
    </ReactRouterRoutes>
  );
};

export default Routes;
