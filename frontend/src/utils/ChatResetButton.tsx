import React from 'react';
import { IoRefreshOutline } from 'react-icons/io5';
import '../css/ChatResetButton.css'; // Import the CSS for styling

interface ChatResetButtonProps {
  onClick: () => void;
}

const ChatResetButton: React.FC<ChatResetButtonProps> = ({ onClick }) => {
  return (
    <button className="chat-reset-button" onClick={onClick}>
      <IoRefreshOutline />
    </button>
  );
};

export default ChatResetButton;