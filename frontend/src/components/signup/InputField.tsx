// src/components/InputField.tsx
import React from 'react';

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  isValid?: boolean;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ id, label, type, placeholder, value, onChange, isValid, icon }) => {
  return (
    <div className="signupInputGroup">
      <label htmlFor={id} className="signupLabel">{label}</label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="signupInputField"
      />
      <div className="signupUnderline"></div>
      {icon && <div className="signupPasswordIcon">{icon}</div>}
    </div>
  );
};

export default InputField;

// 이 줄을 추가합니다. 빈 export 구문
export {};
