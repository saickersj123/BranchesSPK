// src/components/SignupButton.tsx
import React from 'react';
import { Button } from 'react-bootstrap';

const SignupButton: React.FC = () => {
  return (
    <Button variant="primary" type="submit" className="signupButton">
      회원가입
    </Button>
  );
};

export default SignupButton;
