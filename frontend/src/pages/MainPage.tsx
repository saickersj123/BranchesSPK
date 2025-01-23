import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css';
import branchImage from '../img/branch_BL.png';
import { checkAuthStatus } from '../api/axiosInstance';
import { set_routes } from '../Routes';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        if (response.valid) {
          navigate(set_routes.SERVICE_PAGE);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuth();
  }, [navigate]);

  const LoginClick = useCallback(() => {
    navigate(set_routes.LOGIN);
  }, [navigate]);

  const NewSignupClick = useCallback(() => {
    navigate(set_routes.SIGNUP);
  }, [navigate]);

  const handleClick = () => {
    setIsClicked(true);
  };

  return (
    <div className='main' onClick={handleClick}>
      <div className={`mainChild ${isClicked ? 'shrink' : ''}`}>
        <img className='branchBl1' alt="" src={branchImage} />
      </div>
      <div className={`mainItem ${isClicked ? 'visible' : ''}`}>
        <div className={`wrapper ${isClicked ? 'visible' : ''}`} onClick={LoginClick}>
          <div className='div'>로그인</div>
        </div>
        <div className={`component3 ${isClicked ? 'visible' : ''}`} onClick={NewSignupClick}>
          <div className='div'>회원가입</div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;