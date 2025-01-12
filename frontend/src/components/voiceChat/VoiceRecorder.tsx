import React, { useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faPlay } from '@fortawesome/free-solid-svg-icons';
import '../../css/voiceChat/VoiceRecorder.css';

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
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

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  return (
    <div className="voice-recorder">
      {!isRecording && (
        <Button variant="primary" onClick={startRecording}>
          <FontAwesomeIcon icon={faMicrophone} /> 녹음 시작
        </Button>
      )}
      {isRecording && (
        <Button variant="danger" onClick={stopRecording}>
          <FontAwesomeIcon icon={faStop} /> 녹음 중지
        </Button>
      )} 
    </div>
  );
};

export default VoiceRecorder;