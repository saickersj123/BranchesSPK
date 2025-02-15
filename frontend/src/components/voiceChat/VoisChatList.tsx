import React, { useEffect, useRef } from 'react';
import { Message } from '../../@types/types';
import '../../css/voiceChat/VoiceChatList.css'; 
import SoundButton from '../../utils/SoundButton';
import CopyButton from '../../utils/CopyButton';

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
    <div className="voice-chat-list">
      {messages.length === 0 ? (
        <div className="no-messages"> 
          🎤 음성 대화를 시작해보세요! 마이크를 사용하여 메시지를 보내보세요.
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`voice-message-container ${msg.role}`}
          >
            {msg.role === 'assistant' && (
              <div className="chatbot-icon">AI</div>
            )}
            <div className={`voice-message ${msg.role}`}>
              {msg.content.split('\n').map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))}
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
                    <CopyButton />
                  </button>
                </>
              )}
              {msg.audioUrl && (
                <button onClick={() => handlePlayAudio(msg.audioUrl)} className="voice-chat-play-button">
                  <SoundButton />
                </button>
              )}
            </div>
          </div>
        ))
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default VoisChatList;