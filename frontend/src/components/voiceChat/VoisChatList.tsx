import React from 'react';
import { Message } from '../../@types/types'; // Message 타입 import
import '../../css/voiceChat/VoisChatList.css';
import LOGO_IMG from '../../img/Nlogo3.png'; // 이미지 import

interface VoisChatListProps {
  messages: Message[]; // 메시지를 props로 받기
}

const VoisChatList: React.FC<VoisChatListProps> = ({ messages }) => {
  return (
    <div className="vois-chat-list">
      {messages.map((msg, index) => (
        <div key={index} className={`voice-message-container ${msg.role}`}>
          {msg.role === 'ai' && (
            <div className="chatbot-icon">
              <img src={LOGO_IMG} alt="AI Profile" /> {/* AI 프로필 이미지 */}
            </div>
          )}
          <div className={`voice-message ${msg.role}`}>
            <span>{msg.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VoisChatList;
