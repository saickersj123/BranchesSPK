import React, { useEffect, useRef } from 'react';
import { Message } from '../../@types/types';
import '../../css/scenarioPage/ScenarioChatList.css'; 
import SoundButton from '../../utils/SoundButton';
import CopyButton from '../../utils/CopyButton';

interface ScenariosChatListProps {
  messages: Message[];
}

const ScenariosChatList: React.FC<ScenariosChatListProps> = ({ messages }) => {
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
    <div className="scenarios-chat-list">
      {messages.length === 0 ? (
        <div className="no-messages"> 
          🎤 음성 대화를 시작해보세요! 마이크를 사용하여 메시지를 보내보세요.
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`scenarios-message-container ${msg.role}`}
          >
            {msg.role === 'assistant' && (
              <div className="scenarios-chatbot-icon">AI</div>
            )}
            <div className={`scenarios-message ${msg.role}`}>
              {msg.content}
              {msg.role === 'user' ? (
                <span className="scenarios-user-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              ) : (
                <>
                  <span className="scenarios-ai-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="scenarios-copy-button"
                  >
                    <CopyButton />
                  </button>
                </>
              )}
              {msg.audioUrl && (
                <button onClick={() => handlePlayAudio(msg.audioUrl)} className="scenarios-chat-play-button">
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

export default ScenariosChatList;