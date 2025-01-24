import React  from 'react';
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
import { User } from './@types/types'; 
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
  //시나리오 관련 라우트
  SCENARIO_LIST: '/scenariolist',
  SCENARIO_CHAT: '/scenarioChat',

  //음성 채팅 관련 라우트
  VOICE_CHAT: '/voiceChat',

  //텍스트 채팅 관련 라우트
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
 

  return (
    <ReactRouterRoutes>
      <Route path={set_routes.LANDING_PAGE} element={<MainPage />} />
      <Route path={set_routes.SERVICE_PAGE} element={<ServicePage />} />
      <Route path={set_routes.SIGNUP} element={<Signup />} />
      <Route path={set_routes.LOGIN} element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
      <Route path={set_routes.MY_PAGE} element={<MyPage username={username} setUsername={setUsername} />} />
      <Route path={set_routes.LEVEL_PROFILE_PAGE} element={<LevelProfilePage />} />

      {/** 시나리오 관련 라우트 */}
      <Route path={set_routes.SCENARIO_LIST} element={<ScenarioList page={'/'} />} />
      <Route path={set_routes.SCENARIO_CHAT} element={<ScenarioChat />} />
      <Route path={set_routes.SCENARIO_CHAT + '/:conversationId'} element={<ScenarioChat/>} />
    
      {/** 음성 채팅 관련 라우트 */}
      <Route path={set_routes.VOICE_CHAT} element={<VoiceChat/>} />
      <Route path={set_routes.VOICE_CHAT + '/:conversationId'} element={<VoiceChat />} />

      {/** 텍스트 채팅 관련 라우트 */}
      <Route path={set_routes.TEXT_CHAT} element={<TestChat/> } />
      <Route path={set_routes.TEXT_CHAT + '/:conversationId'} element={<TestChat/> } /> 
      
      <Route path="*" element={<Navigate to={set_routes.LANDING_PAGE} />} />  
    </ReactRouterRoutes>
  );
};

export default Routes;
