import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserGear, 
  faChartLine, 
  faRightFromBracket, 
  faUserCircle,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../utils/Logout';
import '../../css/userSetDropdown/UserSetDropdown.css';
import { checkAuthStatus } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { set_routes } from '../../Routes';
import { gethUserExperience } from '../../api/UserInfo';


interface UserSetDropdownProps {
  currentPage: string; 
}

const UserSetDropdown: React.FC<UserSetDropdownProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [userName, setUserName] = useState<string>("");
  const [userLevel, setUserLevel] = useState<number>(0);
  const [userXP, setUserXP] = useState<number>(0);
  const [nextLevelXP, setNextLevelXP] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await gethUserExperience();
      setUserLevel(userInfo.level);
      setUserXP(userInfo.exp); 
      setNextLevelXP(userInfo.nextLevelXP);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await checkAuthStatus();
      //  console.log(userInfo); 
      const name = userInfo.user?.name || "";
      //const email = userInfo.email || "";
      setUserName(name); 
    };
    fetchData();
  }, []); 

  const handleProfileClick = () => {
    navigate(set_routes.MY_PAGE, { state: { from: currentPage } });
  };

  const handlelevelProfileClick = async () => {
    navigate(set_routes.LEVEL_PROFILE_PAGE, { state: { from: currentPage } });
  };  

  return (
    <div className="UserSet-voice-chat-dropdpown-settings-container">
      <Dropdown align="end">
        <Dropdown.Toggle id="UserSet-voice-chat-dropdpown-setting-icon" className="UserSet-voice-chat-dropdpown-settings-button">
          {userName.charAt(0).toUpperCase()}
        </Dropdown.Toggle>
        <Dropdown.Menu className="UserSet-voice-chat-dropdpown-menu">
          <div className="UserSet-user-info">
            <div className="UserSet-user-icon">
              <FontAwesomeIcon icon={faUserCircle} />
            </div>
            <div>
              <div className="UserSet-user-name">{userName}</div>
              <div className="UserSet-user-level">LV {userLevel}</div>
            </div>
          </div>
          <div className="UserSet-user-xp-bar">
            <div className="UserSet-user-xp" style={{ width: `${(userXP / nextLevelXP) * 100}%` }}></div>
          </div>
          <div className="UserSet-user-xp-text">{userXP}/{nextLevelXP} XP</div>
          <div className="UserSet-user-next-level">다음 레벨까지 {nextLevelXP - userXP} XP</div>

          <hr className="UserSet-divider" /> 
          
          <Dropdown.Item onClick={handleProfileClick} className="UserSet-voice-chat-dropdpown-list">
            <FontAwesomeIcon icon={faUserGear} /> 내 프로필
          </Dropdown.Item> 
          <Dropdown.Item onClick={handlelevelProfileClick} className="UserSet-voice-chat-dropdpown-list">
            <FontAwesomeIcon icon={faChartLine} /> 계정 설정
          </Dropdown.Item>
          <Dropdown.Item className="UserSet-voice-chat-dropdpown-list" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserSetDropdown;
