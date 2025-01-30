import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/login/LoginForm';
import '../../css/login/Login.css';
import branchImage from '../../img/PRlogo2.png';
import { set_routes } from '../../Routes'; 

const Login: React.FC = ({ }) => {
  const navigate = useNavigate();

  return (
    <div className="login-container"> 
      <div className='loginPage'>
        <div className="login-center-box">
          <div className='logininputGroup'>
            <img src={branchImage} alt="logo" onClick={() => navigate(set_routes.LANDING_PAGE)}/>
          </div>
        </div> 
        <div className="login-center-box">
          <LoginForm  />
        </div>
      </div>
    </div>
  );
};

export default Login;