import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserGear, 
  faChartLine, 
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../utils/Logout';
import '../../css/userSetDropdown/UserSetDropdown.css';
import { checkAuthStatus } from '../../api/axiosInstance';
import { useState, useEffect } from 'react';
import { set_routes } from '../../Routes';
interface UserSetDropdownProps {
  currentPage: string; 
}

const UserSetDropdown: React.FC<UserSetDropdownProps> = ({ currentPage }) => {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const [userName, setUserName] = useState<string>("");
  
  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await checkAuthStatus();
      //  console.log(userInfo); 
      const name = userInfo.user?.name || "";
      //const email = userInfo.email || "";
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
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
    <div className="voice-chat-dropdpown-settings-container">
      <Dropdown align="end">
        <Dropdown.Toggle id="voice-chat-dropdpown-setting-icon" className="voice-chat-dropdpown-settings-button">
          {userName.charAt(0)}
        </Dropdown.Toggle>
        <Dropdown.Menu className="voice-chat-dropdpown-menu">
          <Dropdown.Item onClick={handleProfileClick} className="voice-chat-dropdpown-list">
            <FontAwesomeIcon icon={faUserGear} /> {userName}
          </Dropdown.Item> 
          <Dropdown.Item onClick={handlelevelProfileClick} className="voice-chat-dropdpown-list">
            <FontAwesomeIcon icon={faChartLine} /> 경험치 확인
          </Dropdown.Item>
          <Dropdown.Item className="voice-chat-dropdpown-list" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserSetDropdown;
