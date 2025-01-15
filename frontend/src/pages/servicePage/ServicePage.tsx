import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceOption from '../../components/service/ServiceOption';
import '../../css/service/Service.css';

const Service: React.FC = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const services = [
    {
      id: 'voice', 
      title: '음성 대화',
      description: '자연스러운 음성 대화를 나눠보세요'
    },
    {
      id: 'text', 
      title: '채팅',
      description: '텍스트로 대화를 나눠보세요'
    },
    {
      id: 'scenario', 
      title: '시나리오',
      description: '시나리오를 즐겨보세요'
    }
  ];

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleStart = () => {
    if (selectedService) {
      // 선택된 서비스에 따라 다른 경로로 이동
      switch (selectedService) {
        case 'voice':
          navigate('/voiceChat');
          break;
        case 'text':
          navigate('/textChat');
          break;
        case 'scenario':
          navigate('/scenarios');
          break; 
        default:
          break;
      }
    }
  };

  return (
    <div className="service-container"> 
      <div className="service-list-section">
        <h1 className="service-title">AI 서비스 선택</h1>
        <div className="service-list">
          {services.map((service) => (
            <ServiceOption
              key={service.id} 
              title={service.title}
              description={service.description}
              onClick={() => handleServiceSelect(service.id)}
              isSelected={selectedService === service.id}
            />
          ))}
        </div>
        <button 
          className="start-button"
          onClick={handleStart}
          disabled={!selectedService}
        >
          시작하기
        </button>
      </div>
    </div>
  );
};

export default Service;