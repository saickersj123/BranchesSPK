import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faSpinner  } from '@fortawesome/free-solid-svg-icons';
import '../../css/voiceChat/VoiceRecorder.css';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
  responseWait: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend, responseWait }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [, setAudioURL] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onSend(audioBlob);
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('마이크 접근 실패:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="voice-recorder-container">
      <div className="voice-recorder">
        {responseWait ? (
          <div className="voice-recorder-button-wait">
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
        ) : (
          <>
            {!isRecording && (
              <Button
                variant="primary"
                onClick={startRecording}
                className="voice-recorder-button-start"
                disabled={responseWait}
              >
                <FontAwesomeIcon icon={faMicrophone} />
              </Button>
            )}
            {isRecording && (
              <Button
                variant="danger"
                onClick={stopRecording}
                className="voice-recorder-button-stop"
                disabled={responseWait}
              >
                <FontAwesomeIcon icon={faStop} />
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;