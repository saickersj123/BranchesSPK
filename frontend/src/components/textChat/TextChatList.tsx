import React, { useEffect, useRef } from 'react';
import { Message } from '../../@types/types';
import '../../css/textChat/TextChatList.css'; 
import SoundButton from '../../utils/SoundButton';
import CopyButton from '../../utils/CopyButton';

interface TextChatListProps {
  messages: Message[];
}

const TextChatList: React.FC<TextChatListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // Run effect when messages change

  const handlePlayAudio = (audioBuffer: string) => {
    const audio = new Audio(`data:audio/wav;base64,${audioBuffer}`);
    audio.play().catch(error => {
      console.error("오디오 재생 중 오류 발생:", error);
    });
  };

  return (
    <div className="text-chat-list">
      {messages.length === 0 ? (
        <div className="text-no-messages"> 
          텍스트 대화를 시작해보세요! 텍스트를 사용하여 메시지를 보내보세요.
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`text-message-container ${msg.role}`}
          >
            {msg.role === 'assistant' && (
              <div className="chatbot-icon">AI</div>
            )}
            <div className={`text-message ${msg.role}`}>
              {msg.content.split('\n').map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))}
              {msg.role === 'user' ? (
                <span className="text-user-time">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              ) : (
                <>
                  <span className="text-ai-time">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="text-copy-button"
                  >
                    <CopyButton />
                  </button>
                </>
              )}
              {msg.audioUrl && (
                <button onClick={() => handlePlayAudio(msg.audioUrl)} className="text-chat-play-button">
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

export default TextChatList;