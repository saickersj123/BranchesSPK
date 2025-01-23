import React from 'react';
import '../../css/servicePage/ServieceOption.css';

interface ServiceOptionProps { 
  title: string;
  description: string;
  onClick: () => void;
  isSelected?: boolean;
}

const ServiceOption: React.FC<ServiceOptionProps> = ({ 
  title,
  description,
  onClick,
  isSelected = false
}) => {
  return (
    <div 
      className={`service-option ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >  
      <h3 className="service-option-title">{title}</h3>
      <p className="service-option-description">{description}</p>
    </div>
  );
};

export default ServiceOption;