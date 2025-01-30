import React, { useState } from 'react';
import ServiceModal from '../../components/servicePage/SeiviceModal';
import { useNavigate } from 'react-router-dom';
import '../../css/servicePage/ServicePageContents.css';
import introImage from '../../img/intro.png'; // intro.png 파일 경로 추가

const ServicePageContents: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>  
      
      <div className="servicepage_intro-container">
        <img src={introImage} alt="Intro Image" className="servicepage_intro-image" />
      </div>

      <div className="servicepage_action-buttons">
        <button className="servicepage_start-button" onClick={() => navigate('/VoiceChat')}>
          시작하기
        </button>
        <button className="servicepage_mode-select-button" onClick={openModal}>
          옵션
        </button>
      </div>

      <p className="servicepage_footer-text">
        시작하기 - 음성대화
        <br />
        모드선택 - 음성대화, 시나리오, 일반대화
      </p>

      <ServiceModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ServicePageContents;
