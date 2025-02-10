import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../../@types/types';
import '../../css/scenarioPage/ScenarioChatList.css'; 
import SoundButton from '../../utils/SoundButton';
import CopyButton from '../../utils/CopyButton';

interface ScenariosChatListProps {
  messages: Message[];
}

const ScenariosChatList: React.FC<ScenariosChatListProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    // 메시지가 업데이트된 후 스크롤을 아래로 내리기
    setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
    
    // 새로운 메시지가 추가될 때 자동으로 오디오 재생
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.audioUrl) {
        handlePlayAudio(lastMessage.audioUrl);
        // 게임 결과가 참일 경우 축하 메시지 표시
        const lastUserMessage = messages[messages.length - 2];
        if (lastUserMessage && lastUserMessage.gameResult) {  
          setShowCongrats(true);
          setTimeout(() => setShowCongrats(false), 3000); // 3초 후에 사라지게
        }
      } 
       
    }
  }, [messages]); 

  useEffect(() => {
    if (showCongrats) {
      console.log("축하 메시지 표시 !!! : ", showCongrats); 
      //분명 값 탐지는 되는데 밑에서 scenarios-chat-congrats-message가 렌더링이 안되는 이유가 뭘까?
    }
  }, [showCongrats]);

  const handlePlayAudio = (audioBuffer: string) => {
    const audio = new Audio(`data:audio/wav;base64,${audioBuffer}`);
    audio.play().catch(error => {
      console.error("오디오 재생 중 오류 발생:", error);
    });
  };

  return (
    <div className="scenarios-chat-list">
      {showCongrats && (
        <div className="scenarios-chat-congrats-message">축하합니다! 🎉</div>
      )}
      {messages.length === 0 ? (
        <div className="scenarios-no-messages"> 
          🎤 음성 대화를 시작해보세요! 마이크를 사용하여 메시지를 보내보세요.
        </div>
      ) : ( 
        messages.map((msg, index) => {
          if (msg.content) {
            return (
              <div 
                key={index}
                className={`scenarios-message-container ${msg.role}`}
              >
                {msg.role === 'assistant' && (
                  <div className="scenarios-chatbot-icon">AI</div>
                )}
                <div className={`scenarios-message ${msg.role}`}>
                  {msg.content.split('\n').map((line, index) => (
                    <span key={index}>{line}<br /></span>
                  ))}
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
            );
          } else {
            console.warn(`Message at index ${index} is invalid:`, msg);
            return null; // Skip rendering for invalid messages
          }
        })
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ScenariosChatList;