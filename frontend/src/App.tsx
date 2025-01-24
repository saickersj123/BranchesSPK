import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/App.css';
import Routes from './Routes';
import { checkAuthStatus } from './api/axiosInstance';  

export interface User {
  name: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);  
  const [username, setUsername] = useState<string>(''); 

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
          username={username}
          setUsername={setUsername} 
        />
      </div>
    </Router>
  );
};

export default App;