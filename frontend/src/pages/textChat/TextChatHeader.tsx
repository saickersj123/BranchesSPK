import React from 'react'; 
import '../../css/textChat/TextChatHeader.css';  
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
    isSidebarOpen
}) => {
  const navigate = useNavigate(); 

  return (
    <>
      <div className={`text-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}> 
        <div className="text-chat-title-logo">
          <span className="brand-text-text" onClick={() => navigate(set_routes.TEXT_CHAT)}>BranchesSPK</span>
        </div>
        <UserSetDropdown currentPage="/textChat" />
      </div>
      <div className={`new-main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default VoiceChatHeader;