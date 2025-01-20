 
import React, { useRef, useEffect } from 'react';
import '../../css/ChatList.css';
import AI_Logo from '../../img/Nlogo3.png';

interface Message {
  content: string;
  role: string;
  createdAt: string;
  audioUrl: string;
}

interface ChatMessageProps {
  content: string;
  role: string;
  time: string;
  username: string;
  showTime: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, time, username, showTime }) => {
  let timeString = '';
  if (time && !isNaN(new Date(time).getTime())) {
    timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  } else {
    timeString = 'Invalid Date';
  }
  const displayUsername = role === 'assistant' ? 'AI' : (username || 'You');
  const bubbleStyle = {
    backgroundColor: role === 'user' ? 'var(--my-chat-bubble-color)' : 'var(--other-chat-bubble-color)',
    color: role === 'user' ? 'var(--my-chat-text-color)' : 'var(--other-chat-text-color)',
    fontWeight: 'var(--chat-bubble-bold)',
    boxShadow: 'var(--chat-bubble-shadow)',
  };

  return (
    <div className={`message-container ${role === 'user' ? 'sent-by-user' : 'received'}`}>
      {role === 'assistant' && (
        <div className="chatbot-icon">
          <img src={AI_Logo} alt="AI" />
        </div>
      )}
      <div className="bubble-wrapper">
        <div className="username">{displayUsername}</div>
        <div className="bubble-container">
          <div className="bubble" style={bubbleStyle}>
            {content}
          </div>
          {showTime && <div className="time">{timeString}</div>}
        </div>
      </div>
    </div>
  );
};

interface ChatListProps {
  messages: Message[];
  username: string;
  showTime: boolean;
}

const ChatList: React.FC<ChatListProps> = ({ messages, username, showTime }) => {
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatListRef.current) {
      const scrollHeight = chatListRef.current.scrollHeight;
      const height = chatListRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      chatListRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  return (
    <div className="chat-list" ref={chatListRef} style={{ backgroundColor: 'var(--chat-container-bg-color)' }}>
      {messages.length === 0 ? (
        <div className="empty-chat-message">
          <p>새로운 대화를 시작해 보세요!</p>
          <p>질문을 입력하시면 대화를 시작할 수 있습니다.</p>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            role={message.role}
            time={message.createdAt}
            username={username}
            showTime={showTime}
          />
        ))
      )}
    </div>
  );
};

export default ChatList;