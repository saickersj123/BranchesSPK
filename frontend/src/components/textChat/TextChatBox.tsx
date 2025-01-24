import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import '../../css/textChat/TextChatBox.css';

interface VoiceRecorderProps {
  onSend: (messageContent: string) => void;
  responseWait: boolean;
}

const TextInput: React.FC<VoiceRecorderProps> = ({ onSend, responseWait }) => {
  const [message, setMessage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !responseWait && message.trim()) {
      handleSend();
    }
  };

  useEffect(() => {
    if (!responseWait) {
      inputRef.current?.focus();
    }
  }, [responseWait]);

  return (
    <div className="text-input-container">
      <div className="text-input">
        {responseWait ? (
          <div className="text-input-wait">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : (
          <>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="text-input-field"
              disabled={responseWait}
              ref={inputRef}
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