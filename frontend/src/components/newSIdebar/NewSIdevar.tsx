import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/newsidebar/NewSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGamepad, faHome } from '@fortawesome/free-solid-svg-icons';

interface NewSidebarProps {
  isOpen: boolean;
}

const NewSidebar: React.FC<NewSidebarProps> = ({ isOpen }) => {
    const navigate = useNavigate();

    return (
        <div className={`new-sidebar ${isOpen ? 'open' : ''}`}>
            <div className="new-sidebar-content">
                <div className="new-sidebar-menu">
                    <div className="new-menu-item" onClick={() => navigate('/service')}>
                        <FontAwesomeIcon icon={faHome} />
                        <span>홈</span>
                    </div>
                    <div className="new-menu-item" onClick={() => navigate('/mypage')}>
                        <FontAwesomeIcon icon={faUser} />
                        <span>마이페이지</span>
                    </div>
                    <div className="new-menu-item" onClick={() => navigate('/levelProfile')}>
                        <FontAwesomeIcon icon={faGamepad} />
                        <span>경험치 확인</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewSidebar; 
