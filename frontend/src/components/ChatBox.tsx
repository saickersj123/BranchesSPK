import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage, startNewConversationwithmsg } from '../api/axiosInstance';
import { Message } from '../types';

interface ChatBoxProps {
  onNewMessage: (message: Message) => void;
  onUpdateMessage: (message: Message) => void;
  conversationId: string | null;
  isNewChat: boolean;
  onChatInputAttempt: () => void;
  isLoggedIn: boolean;
  selectedModel: string;
  onNewConversation: (newConversationId: string) => Promise<void>;
  isEditMode: boolean;
  setSelectedConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  conversationId,
  onNewMessage,
  onUpdateMessage,
  isEditMode,
  isNewChat,
  selectedModel,
  onChatInputAttempt,
  isLoggedIn,
  onNewConversation,
  setSelectedConversationId
}) => {
  const [message, setMessage] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message, interimTranscript]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoggedIn) {
      onChatInputAttempt();
    } else {
      setMessage(event.target.value);
    }
  };

  const handleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript('');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      setMessage((prevMessage) => prevMessage + finalTranscript);
      setInterimTranscript(interimTranscript);

      resetSilenceTimeout();
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      setShouldSendMessage(true);
    };

    recognition.start();
    recognitionRef.current = recognition;

    resetSilenceTimeout();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
  };

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      stopListening();
    }, 2000);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const sendMessageToServer = useCallback(async () => {
    const fullMessage = (message + interimTranscript).trim();
    if (fullMessage === '') {
      return;
    }

    const newMessage: Message = {
      content: fullMessage,
      role: 'user',
      createdAt: new Date().toISOString(),
    };

    onNewMessage(newMessage);

    try {
      if (isNewChat) {
        const response = await startNewConversationwithmsg(fullMessage);
        const newConversationId = response._id;
        await onNewConversation(newConversationId);
        setSelectedConversationId(newConversationId);
        navigate(`/chat/${newConversationId}`);
        if (response && response.chats && response.chats.length > 0) {
          const aiMessage: Message = {
            content: response.chats[response.chats.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          };
          onUpdateMessage(aiMessage);
        }
      } else if (conversationId) {
        const response = await sendMessage(conversationId, fullMessage);
        if (response && response.length > 0) {
          const aiMessage: Message = {
            content: response[response.length - 1].content,
            role: 'assistant',
            createdAt: new Date().toISOString(),
          };
          onUpdateMessage(aiMessage);
        }
      }
      setMessage('');
      setInterimTranscript('');
    } catch (error) {
      // 에러 처리
    }
  }, [message, interimTranscript, isNewChat, conversationId, onNewMessage, onUpdateMessage, onNewConversation, setSelectedConversationId, navigate]);

  useEffect(() => {
    if (shouldSendMessage) {
      sendMessageToServer();
      setShouldSendMessage(false);
    }
  }, [shouldSendMessage, sendMessageToServer]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessageToServer();
    }
  };

  return (
    <Form className={`chat-input-container ${isInputFocused ? 'focused' : ''}`} onSubmit={(e) => {
      e.preventDefault();
      sendMessageToServer();
    }}>
      <div className="input-button-wrapper">
        <Button
          onClick={handleSpeechRecognition}
          className={`chat-box-button mic-button ${isListening ? 'listening' : ''}`}
          disabled={isEditMode}
        >
          {isListening ? '■' : '🎤'}
        </Button>
        <Form.Control
          as="textarea"
          ref={textareaRef}
          rows={1}
          value={message + interimTranscript}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="메시지를 입력하세요."
          className={`chat-container`}
          disabled={isEditMode}
        />
        <Button
          onClick={(e) => {
            e.preventDefault();
            sendMessageToServer();
          }}
          className={`chat-box-button send-button`}
          disabled={isEditMode || (!message.trim() && !interimTranscript.trim())}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        </Button>
      </div>
    </Form>
  );
};

export default ChatBox;