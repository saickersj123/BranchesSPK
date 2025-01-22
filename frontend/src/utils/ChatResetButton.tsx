import React from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import '../css/ChatResetButton.css'; // Import the CSS for styling

interface ChatResetButtonProps {
  onClick: () => void;
}

const ChatResetButton: React.FC<ChatResetButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    if (window.confirm('대화를 초기화하시겠습니까?')) {
      onClick();
    }
  };

  return (
    <button className="chat-reset-button" onClick={handleClick}>
      <IoRefreshOutline />
    </button>
  );
};

export default ChatResetButton;