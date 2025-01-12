import { Dropdown } from 'react-bootstrap';
import '../../css/voiceChat/VoiceChatHeader.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../../utils/Logout';  
import { useNavigate } from 'react-router-dom';
import { TbLayoutSidebar } from 'react-icons/tb';
import { useState } from 'react';

const VoiceChatHeader = () => {
    const handleLogout = useLogout();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const handleProfileClick = () => {
        navigate('/mypage', { state: { from: '/voiceChat' } });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>   
            <button className="toggle-sidebar-button" onClick={toggleSidebar}>
                <TbLayoutSidebar size={35}/>
            </button>
            <div className="voice-chat-title-logo" onClick={() => navigate('/voiceChat')}>Braches-SPK</div>
            <div className="voice-chat-settings-container">
                <Dropdown align="end">
                    {/* 화살표 제거 및 동그란 버튼 */}
                    <Dropdown.Toggle
                        id="voice-chat-setting-icon"
                        className="voice-chat-settings-button"
                    >
                        AI {/* 버튼 안의 텍스트 */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="home-dropdown-menu">
                        <Dropdown.Item onClick={handleProfileClick} className="home-dropdown-list">
                            <FontAwesomeIcon icon={faUser} /> 마이페이지
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout} className="home-dropdown-list">
                            <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        </div>
    );
};

export default VoiceChatHeader;
