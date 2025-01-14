import { Dropdown } from 'react-bootstrap';
import '../../css/voiceChat/VoiceChatHeader.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../../utils/Logout';  
import { useNavigate } from 'react-router-dom';
import { TbLayoutSidebar } from 'react-icons/tb';  


interface VoiceChatHeaderProps {
    isSidebarOpen: boolean; // isSidebarOpen 추가
  }
  
  const VoiceChatHeader: React.FC<VoiceChatHeaderProps> = ({ isSidebarOpen }) => {
    const handleLogout = useLogout();
    const navigate = useNavigate(); 
    const handleProfileClick = () => {
        navigate('/mypage', { state: { from: '/voiceChat' } });
    };

    const toggleSidebar = () => { 
        setIsSidebarOpen(!isSidebarOpen); 
    };

    const setIsSidebarOpen = (isSidebarOpen: boolean) => {    
        setIsSidebarOpen(isSidebarOpen);
    };
  return (
    <div className={`voice-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button className="toggle-sidebar-button" onClick={toggleSidebar}>
        <TbLayoutSidebar size={35} />
      </button>
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
              <FontAwesomeIcon icon={faUser} /> 마이페이지
            </Dropdown.Item>
            <Dropdown.Item className="voice-chat-dropdown-list" onClick={handleLogout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default VoiceChatHeader;