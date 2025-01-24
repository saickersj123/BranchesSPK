import React from 'react'; 
import '../../css/voiceChat/VoiceChatHeader.css';  
import { useNavigate } from 'react-router-dom';
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown';
import { set_routes } from '../../Routes';

interface VoiceChatHeaderProps {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onReset: () => void;
}

const VoiceChatHeader: React.FC<VoiceChatHeaderProps> = ({ 
    children, 
    isSidebarOpen, 
    setIsSidebarOpen,
    onReset
}) => {
  const navigate = useNavigate(); 

  return (
    <>
      <div className={`voice-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}> 
        <div className="voice-chat-title-logo">
          <span className="brand-text-voice" onClick={() => navigate(set_routes.VOICE_CHAT)}>FreeTalking</span>
        </div>
        <UserSetDropdown currentPage="/voiceChat" />
      </div>
      <div className={`new-main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default VoiceChatHeader;