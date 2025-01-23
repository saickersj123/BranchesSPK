import React from 'react';
import '../../css/voiceChat/ConversationItem.css';

interface ConversationItemProps {
  id: string;
  onClick: (id: string) => void;
  isActive: boolean;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ id, onClick, isActive }) => {
  return (
    <li 
      className={`conversation-item ${isActive ? 'active' : ''}`} 
      onClick={() => onClick(id)}
    >
      Conversation {id}
    </li>
  );
};

export default ConversationItem;