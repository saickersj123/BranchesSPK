import React, { useState, useRef, useEffect } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../../css/textChat/TextChatBox.css';

interface VoiceRecorderProps {
  onSend: (messageContent: string) => void;
  responseWait: boolean;
}

const TextInput: React.FC<VoiceRecorderProps> = ({ onSend, responseWait }) => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !responseWait) {
      event.preventDefault();
      if (event.shiftKey) {
        setMessage((prev) => prev + '\n');
      } else if (message.trim()) {
        handleSend();
      }
    }
    adjustHeight();
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
    adjustHeight();
  };

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (!responseWait) {
      inputRef.current?.focus();
    }
  }, [responseWait]);

  useEffect(() => {
    adjustHeight();
  }, [message]);

  return (
    <div className="text-input-container">
      <div className="text-input">
        {responseWait ? (
          <div className="text-input-wait">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : (
          <>
            <textarea
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="text-input-field"
              disabled={responseWait}
              ref={inputRef}
              rows={1}
            />
            <button
              onClick={handleSend}
              className="text-input-button-send"
              disabled={responseWait || !message.trim()}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TextInput;