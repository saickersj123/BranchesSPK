import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/newsidebar/NewSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faComments, faMicrophone, faBook } from '@fortawesome/free-solid-svg-icons';
import SidebarIcon from '../../utils/SidebarIcon'; 
import { set_routes } from '../../Routes';
interface NewSidebarProps {
    isOpen: boolean;
    onToggle?: () => void;
}

const NewSidebar: React.FC<NewSidebarProps> = ({ isOpen, onToggle }) => {
    const navigate = useNavigate();
 

    return (
        <>
            <button className="new-sidebar-toggle-button" onClick={onToggle}>
                <SidebarIcon />
            </button>
            
            <div className={`new-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="new-sidebar-content">
                    <div className="new-sidebar-menu">
                        <div className="new-menu-item" onClick={() => navigate(set_routes.LANDING_PAGE)}>
                            <FontAwesomeIcon icon={faHome} />
                            <span>메인페이지</span>
                        </div>
                        <div className="new-menu-divider"></div>
                        <div className="new-menu-item" onClick={() => navigate(set_routes.VOICE_CHAT)}>
                            <FontAwesomeIcon icon={faMicrophone} />
                            <span>음성 대화</span>
                        </div>
                        <div className="new-menu-item" onClick={() => navigate(set_routes.TEXT_CHAT)}>
                            <FontAwesomeIcon icon={faComments} />
                            <span>문자 대화</span>
                        </div>
                        <div className="new-menu-item" onClick={() => navigate(set_routes.SCENARIO_LIST)}>
                            <FontAwesomeIcon icon={faBook} />
                            <span>시나리오</span>
                        </div>  
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewSidebar; 
