import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage, startNewConversationwithmsg, sendVoiceMessage } from '../api/axiosInstance';
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
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoggedIn) {
      onChatInputAttempt();
    } else {
      setMessage(event.target.value);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(2048, 1, 1);

      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        const isSilent = input.every(sample => Math.abs(sample) < 0.01);

        if (isSilent) {
          if (!silenceTimeoutRef.current) {
            silenceTimeoutRef.current = setTimeout(() => {
              stopRecording();
            }, 3000);
          }
        } else {
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        console.log('녹음된 오디오 URL:', audioUrl);

        if (conversationId) {
          try {
            const response = await sendVoiceMessage(conversationId, audioBlob);
            if (response.length > 0) {
              onUpdateMessage(response[response.length - 1]);
            }
          } catch (error) {
            console.error('음성 메시지 처리 실패:', error);
          }
        }
        stream.getTracks().forEach(track => track.stop());
        processor.disconnect();
        source.disconnect();
        audioContext.close();
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('마이크 접근 실패:', error);
      alert('마이크 접근이 거부되었습니다.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const sendMessageToServer = useCallback(async () => {
    const fullMessage = message.trim();
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
    } catch (error) {
      console.error('메시지 전송 실패:', error);
    }
  }, [message, isNewChat, conversationId, onNewMessage, onUpdateMessage, onNewConversation, setSelectedConversationId, navigate]);

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
          onClick={isRecording ? stopRecording : startRecording}
          className={`chat-box-button mic-button ${isRecording ? 'recording' : ''}`}
          disabled={isEditMode}
        >
          {isRecording ? '■' : '🎤'}
        </Button>
        <Form.Control
          as="textarea"
          ref={textareaRef}
          rows={1}
          value={message}
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
          disabled={isEditMode || !message.trim()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        </Button>
      </div>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </Form>
  );
};

export default ChatBox;