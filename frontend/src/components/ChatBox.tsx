import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../css/ChatBox.css';
import { useNavigate } from 'react-router-dom';
import { sendMessage, startNewConversationwithmsg, sendVoiceMessage } from '../api/axiosInstance';
import { Message } from '../@types/types';

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
  conversationId, onNewMessage, onUpdateMessage, isEditMode, isNewChat, selectedModel,
  onChatInputAttempt, isLoggedIn, onNewConversation, setSelectedConversationId
}) => {
  const [message, setMessage] = useState<string>('');
  const [shouldSendMessage, setShouldSendMessage] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    !isLoggedIn ? onChatInputAttempt() : setMessage(event.target.value);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendVoiceMessageToServer(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Microphone access was denied.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleInputFocus = () => setIsInputFocused(true);
  const handleInputBlur = () => setIsInputFocused(false);

  const sendMessageToServer = useCallback(async () => {
    const fullMessage = message.trim();
    if (fullMessage === '') return;

    const newMessage: Message = { content: fullMessage, role: 'user', createdAt: new Date().toISOString() };
    onNewMessage(newMessage);

    try {
      if (isNewChat) {
        const response = await startNewConversationwithmsg(fullMessage);
        const newConversationId = response._id;
        await onNewConversation(newConversationId);
        setSelectedConversationId(newConversationId);
        navigate(`/chat/${newConversationId}`);
        if (response?.chats?.length > 0) {
          const aiMessage: Message = { content: response.chats[response.chats.length - 1].content, role: 'assistant', createdAt: new Date().toISOString() };
          onUpdateMessage(aiMessage);
        }
      } else if (conversationId) {
        const response = await sendMessage(conversationId, fullMessage);
        if (response?.length > 0) {
          const aiMessage: Message = { content: response[response.length - 1].content, role: 'assistant', createdAt: new Date().toISOString() };
          onUpdateMessage(aiMessage);
        }
      }
      setMessage('');
    } catch (error) {
      console.error('Message sending failed:', error);
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

  const sendVoiceMessageToServer = async (audioBlob: Blob) => {
    if (conversationId) {
      try {
        const response = await sendVoiceMessage(conversationId, audioBlob);
        if (response) {
          const { audioUrl, text } = response;
          const aiMessage: Message = { content: text, role: 'assistant', createdAt: new Date().toISOString() };
          onUpdateMessage(aiMessage);
          playAudio(audioUrl);
        }
      } catch (error) {
        console.error('Voice message failed:', error);
      }
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  return (
    <Form className={`chat-input-container ${isInputFocused ? 'focused' : ''}`} onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      sendMessageToServer();
    }}>
      <div className="input-button-wrapper">
        <Button onClick={isRecording ? stopRecording : startRecording} className={`chat-box-button mic-button ${isRecording ? 'recording' : ''}`} disabled={isEditMode}>
          {isRecording ? '■' : '🎤'}
        </Button>
        <Form.Control as="textarea" ref={textareaRef} rows={1} value={message} onChange={handleMessageChange} onKeyDown={handleKeyPress} onFocus={handleInputFocus} onBlur={handleInputBlur} placeholder="Type a message..." className="chat-container" disabled={isEditMode} />
        <Button onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.preventDefault();
          sendMessageToServer();
        }} className="chat-box-button send-button" disabled={isEditMode || !message.trim()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
          </svg>
        </Button>
      </div>
    </Form>
  );
};

export default ChatBox;
