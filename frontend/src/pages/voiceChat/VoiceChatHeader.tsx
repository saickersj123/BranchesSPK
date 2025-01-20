import { Dropdown } from 'react-bootstrap';
import '../../css/voiceChat/VoiceChatHeader.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../../utils/Logout';  
import { useNavigate } from 'react-router-dom';

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
  const handleLogout = useLogout();

  const handleProfileClick = () => {
    navigate('/mypage', { state: { from: '/voiceChat' } });
  };  

  const handlelevelProfileClick = async () => {
    navigate("/levelProfile", { state: { from: '/voiceChat' } });
  }; 

  return (
    <>
      <div className={`voice-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="voice-chat-title-logo" onClick={() => navigate('/voiceChat')}>
          Branch-SPK
        </div>
        
        <div className="voice-chat-settings-container">
          <Dropdown align="end">
            <Dropdown.Toggle id="voice-chat-setting-icon" className="voice-chat-settings-button">
              AI
            </Dropdown.Toggle>
            <Dropdown.Menu className="voice-chat-dropdown-menu">
              <Dropdown.Item onClick={handleProfileClick} className="voice-chat-dropdown-list">
                <FontAwesomeIcon icon={faUser} /> 정보수정
              </Dropdown.Item>
              <Dropdown.Item onClick={handlelevelProfileClick} className="voice-chat-dropdown-list">
                <FontAwesomeIcon icon={faUser} /> 경험치 확인
              </Dropdown.Item>
              <Dropdown.Item className="voice-chat-dropdown-list" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <div className={`new-main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default VoiceChatHeader;