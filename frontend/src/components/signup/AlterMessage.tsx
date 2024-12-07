// src/components/AlertMessage.tsx
import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface AlertMessageProps {
  message: string;
  variant: 'danger' | 'success';
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, variant }) => {
  return (
    <Alert variant={variant} className="signupAlert">
      {variant === 'success' ? <FaCheckCircle style={{ marginRight: '10px' }} /> : <FaTimesCircle style={{ marginRight: '10px' }} />}
      {message}
    </Alert>
  );
};

export default AlertMessage;

// 이 줄을 추가합니다. 빈 export 구문
export {};
