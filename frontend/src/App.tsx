import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/App.css';
import Routes from './Routes';
import { checkAuthStatus } from './api/axiosInstance'; 
import { Message } from './@types/types';

export interface User {
  name: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); 
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>('');
  const [nicknameChanged, setNicknameChanged] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        setIsLoggedIn(response.valid);
        if (response.valid && response.user) {
          setUser(response.user);
          setUsername(response.user.name);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);
 

  return (
    <Router>
      <div className='main-app-container'>
        <Routes
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          setUser={setUser}  
          messages={messages}
          setMessages={setMessages}
          username={username}
          setUsername={setUsername}
          nicknameChanged={nicknameChanged}
          setNicknameChanged={setNicknameChanged}
        />
      </div>
    </Router>
  );
};

export default App;