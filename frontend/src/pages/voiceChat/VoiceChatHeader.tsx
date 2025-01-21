import { Dropdown } from 'react-bootstrap';
import '../../css/voiceChat/VoiceChatHeader.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../../utils/Logout';  
import { useNavigate } from 'react-router-dom';
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown';

interface VoiceChatHeaderProps {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const VoiceChatHeader: React.FC<VoiceChatHeaderProps> = ({ 
    children, 
    isSidebarOpen, 
    setIsSidebarOpen 
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className={`voice-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="voice-chat-title-logo">
          <span className="brand-text" onClick={() => navigate('/voiceChat')}>Branch-SPK</span>
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