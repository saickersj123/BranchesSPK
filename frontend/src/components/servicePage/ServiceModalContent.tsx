import React from 'react';
import { ServiceOption } from './ServiceOptionList';
import ServiceOptionCard from './ServiceOptionCard';

interface ServiceModalContentProps {
  services: ServiceOption[];
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
  onStart: () => void;
  onClose: () => void;
}

const ServiceModalContent: React.FC<ServiceModalContentProps> = ({
  services,
  selectedService,
  onServiceSelect,
  onStart,
  onClose
}) => {
  return (
    <div className="service-container">
      <h1 className="service-title">AI 서비스 선택</h1>
      <div className="service-list">
        {services.map((service) => (
          <ServiceOptionCard
            key={service.id}
            title={service.title}
            description={service.description}
            isSelected={selectedService === service.id}
            onClick={() => onServiceSelect(service.id)}
          />
        ))}
      </div>
      <div className="service-button-container">
        <button
          className="service-start-button"
          onClick={onStart}
          disabled={!selectedService}
        >
          시작하기
        </button>
        <button
          className="service-close-button"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default ServiceModalContent;