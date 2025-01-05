import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/UserInfo';
import '../css/Signup.css';
import branchImage from '../img/PRlogo2.png';
import AlertMessage from '../components/signup/AlterMessage';
import FormInput from '../components/signup/FormInput'; // 변경된 부분
import SignupButton from '../components/signup/SignupButton';

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !name || !passwordConfirm) {
      setError('모든 필드를 입력하세요.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('유효한 이메일 주소를 입력하세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await signupUser(email, password, name);
      if (response && response.success) {
        setSuccess(true);
        setTimeout(() => {
            navigate('/login');
        }, 1000);
        setError('');
      } else {
          if (response && response.message === 'Email already in use') {
              setError('이미 사용 중인 이메일입니다.');
          } else {
              setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
          }
      }
    } catch (error: any) {
        if (error.response && error.response.status === 409) {
            setError('이미 사용 중인 이메일입니다.');
        } else {
            setError('회원가입 중 오류가 발생했습니다. 다시 시도하세요.');
        }
    }
  };

  return (
    <div className="signupPage">
      <div className="signup-center-box">
        <div className='signupinputGroup'>
          <img
            src={branchImage}
            alt="Logo"
            className="signupLogo"
            onClick={() => navigate('/')}
          />
        </div>
      </div>
      
      <div className="signup-center-box">
        {error && <AlertMessage message={error} variant="danger" />}
        {success && <AlertMessage message="회원가입에 성공했습니다!" variant="success" />}
        
        <Form className="signupForm" onSubmit={handleSubmit}>
          <FormInput
            id="formEmail"
            label="이메일 주소"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            id="formPassword"
            label="비밀번호"
            type="password"
            placeholder="8~15자리의 비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <FormInput
            id="formPasswordConfirm"
            label="비밀번호 재확인"
            type="passwordConfirm"
            placeholder="8~15자리의 비밀번호를 입력하세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            confirmValue={password} // 비밀번호 확인을 위한 비밀번호 전달
          />

          <FormInput
            id="formName"
            label="닉네임"
            type="text"
            placeholder="닉네임을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <SignupButton />
        </Form>
      </div>
    </div>
  );
};

export default Signup;