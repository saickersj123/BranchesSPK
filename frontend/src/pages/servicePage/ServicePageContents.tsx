import React, { useState } from 'react';
import ServiceModal from '../../components/servicePage/SeiviceModal';
import { useNavigate } from 'react-router-dom';
import '../../css/servicePage/ServicePageContents.css';
import branchImage from '../../img/PRlogo2.png'; // 로고 이미지 경로
import introImage from '../../img/intro.png'; // intro.png 파일 경로 추가

const ServicePageContents: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="servicepage_main-container">
      {/* Header */}
      <div className="servicepage_header-container">
        <img src={branchImage} alt="SPK BRANCHES Logo" className="servicepage_branch-logo" />
      </div>
      <h1 className="servicepage_welcome-message">‘사용자 이름’님 환영합니다!</h1>
      <p className="servicepage_welcome-description">
        SPK BRANCHES는 영어 학습을 위한 인터랙티브 플랫폼입니다.
        <br />
        다양한 학습 모드를 통해 영어를 재미있게 배워보세요.
      </p>

      {/* Intro Image */}
      <div className="servicepage_intro-container">
        <img src={introImage} alt="Intro Image" className="servicepage_intro-image" />
      </div>

      {/* Action Buttons */}
      <div className="servicepage_action-buttons">
        <button className="servicepage_start-button" onClick={() => navigate('/VoiceChat')}>
          시작하기
        </button>
        <button className="servicepage_mode-select-button" onClick={openModal}>
          모드 선택
        </button>
      </div>

      {/* Footer */}
      <p className="servicepage_footer-text">
        시작하기 - 음성대화
        <br />
        모드선택 - 음성대화, 시나리오, 일반대화
      </p>

      {/* Modal */}
      <ServiceModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default ServicePageContents;
