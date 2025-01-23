import React from 'react';
import InputField from './InputField';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  confirmValue?: string; // 비밀번호 확인 필드의 경우
}

const FormInput: React.FC<FormInputProps> = ({ id, label, type, placeholder, value, onChange, confirmValue }) => {
  const isValidPassword = (password: string): boolean => {
    return password.length >= 8 && password.length <= 15;
  };

  const renderIcon = () => {
    if (type === 'password') {
      return value && (isValidPassword(value) ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />);
    }

    if (type === 'passwordConfirm') {
       isValidPassword(value);
    }

    if (type === 'passwordConfirm' && confirmValue) {
      // 비밀번호와 비밀번호 확인을 비교
      return value === confirmValue ? <FaCheckCircle color="green" /> : <FaTimesCircle color="red" />;
    }
    return null;
  };

  return (
    <InputField
      id={id}
      label={label}
      type={type === 'passwordConfirm' ? 'password' : type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      icon={renderIcon()}
    />
  );
};

export default FormInput;