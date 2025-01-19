import React, { useEffect, useRef } from 'react';
import { Message } from '../../@types/types';
import '../../css/voiceChat/VoisChatList.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LuVolume2, LuFiles } from "react-icons/lu";

interface VoisChatListProps {
  messages: Message[];
}

const VoisChatList: React.FC<VoisChatListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    
    // 새로운 메시지가 추가될 때 자동으로 오디오 재생
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.audioUrl) {
        handlePlayAudio(lastMessage.audioUrl);
      } 
    }
  }, [messages]);

  const handlePlayAudio = (audioBuffer: string) => {
    const audio = new Audio(`data:audio/wav;base64,${audioBuffer}`);
    audio.play().catch(error => {
      console.error("오디오 재생 중 오류 발생:", error);
    });
  };

  return (
    <div className="vois-chat-list">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`voice-message-container ${msg.role}`}
        >
          {msg.role === 'assistant' && (
            <div className="chatbot-icon">AI</div>
          )}
          <div className={`voice-message ${msg.role}`}>
            {msg.content}
            {msg.role === 'user' ? (
              <span className="user-time">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
            ) : (
              <>
                <span className="ai-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(msg.content)}
                  className="copy-button"
                >
                  <LuFiles/>
                </button>
              </>
            )}
            {msg.audioUrl && (
              <button onClick={() => handlePlayAudio(msg.audioUrl)} className="voice-chat-play-button">
                <LuVolume2/>
              </button>
            )}
          </div>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default VoisChatList;