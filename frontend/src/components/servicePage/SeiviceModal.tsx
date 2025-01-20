import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceOptions } from './ServiceOptionList';
import ServiceModalContent from './ServiceModalContent';
import '../../css/servicePage/ServiceModal.css';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleStart = () => {
    if (selectedService) {
      const selectedOption = serviceOptions.find(option => option.id === selectedService);
      if (selectedOption) {
        navigate(selectedOption.path);
        onClose();
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="service-modal-overlay">
          <div className="service-modal-content">
            <ServiceModalContent
              services={serviceOptions}
              selectedService={selectedService}
              onServiceSelect={handleServiceSelect}
              onStart={handleStart}
              onClose={onClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceModal;