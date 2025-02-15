import React, { useEffect, useState } from 'react';
import '../../css/servicePage/ServicePageHeader.css';
import branchImage from '../../img/PRlogo2.png';
import { checkAuthStatus } from '../../api/axiosInstance';

// API 응답 타입 정의
interface AuthStatus {
  user?: {
    name?: string;
  };
}

const ServicePageHeader: React.FC = () => { 
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const authStatus: AuthStatus = await checkAuthStatus();
        if (authStatus.user?.name) {
          setUsername(authStatus.user.name);
        }
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    };
    fetchUsername();
  }, []);

  return (
    <div>
      <div className="servicepageheader_container"> 
        <div className="logo-container">
          <img src={branchImage} alt="SPK BRANCHES Logo" className="servicepage_branch-logo" />
          <p className="service-page-username-text">‘{username}’님 환영합니다!</p>
        </div>
        <div className="servicepageheader_text_description">
          <p>
            SPK BRANCHES는 영어 학습을 위한 인터랙티브 플랫폼입니다.
            <br />
            다양한 학습 모드를 통해 영어를 재미있게 배워보세요.
          </p>
        </div>  
      </div> 
    </div>
  );
};

export default ServicePageHeader;
