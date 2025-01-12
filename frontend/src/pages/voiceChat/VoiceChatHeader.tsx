import { Dropdown } from 'react-bootstrap';
import '../../css/voiceChat/VoiceChatHeader.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../../utils/Logout';  
import { useNavigate } from 'react-router-dom';

const VoiceChatHeader = () => {
    const handleLogout = useLogout();
    const navigate = useNavigate();

    const handleProfileClick = () => {
        navigate('/mypage', { state: { from: '/voiceChat' } });
    };

    return (
        <div>  
            <div className='voice-chat-title-logo' onClick={() => navigate('/voiceChat')}>Braches-SPK</div>
            <div className='voice-chat-settings-container'> 
                <Dropdown align="end">
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        수정예쩡
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
