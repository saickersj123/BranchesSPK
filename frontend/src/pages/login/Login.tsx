import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/login/LoginForm';
import '../../css/Login.css';
import branchImage from '../../img/PRlogo2.png';

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<{ name: string } | null>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  return (
    <div className='loginPage'>
      <div className="login-center-box">
        <div className='logininputGroup'>
          <img src={branchImage} alt="logo" onClick={() => navigate('/')}/>
        </div>
      </div>
      
      <div className="login-center-box">
        <LoginForm setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
      </div>
    </div>
  );
};

export default Login;