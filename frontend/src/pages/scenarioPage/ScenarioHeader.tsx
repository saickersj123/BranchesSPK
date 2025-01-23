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
      <div className={`scenario-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}> 
        <div className="scenario-chat-title-logo">
          <span className="brand-text-scenario" onClick={() => navigate(set_routes.VOICE_CHAT)}>Branches-SPK</span>
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