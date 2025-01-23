import React from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import '../css/ChatResetButton.css'; // Import the CSS for styling
import { set_routes } from '../Routes';

interface ChatResetButtonProps {
  onClick: () => void;
  OriginUrl: string;
}

const ChatResetButton: React.FC<ChatResetButtonProps> = ({ onClick, OriginUrl }) => {
  const handleClick = () => {
    if (OriginUrl === set_routes.SCENARIO_LIST || OriginUrl.includes('scenario')) {
      if (window.confirm('시나리오를 초기화하시겠습니까? ')) {
        onClick();
      }
    }
    else{
      if (window.confirm('대화를 초기화하시겠습니까?')) {
        onClick();
      }
    } 
  };

  return (
    <button className="chat-reset-button" onClick={handleClick}>
      <IoRefreshOutline />
    </button>
  );
};

export default ChatResetButton;