import React from 'react'; 
import '../../css/servicePage/ServiceOption.css';

interface ServiceOptionCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const ServiceOptionCard: React.FC<ServiceOptionCardProps> = ({
  title,
  description,
  isSelected,
  onClick
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

export default ServiceOptionCard;