import React from 'react'; 
import '../../css/scenarioPage/ScenarioChatHeader.css';  
import { useNavigate } from 'react-router-dom';
import UserSetDropdown from '../../components/userSetDropdown/UserSetDropdown'; 
import { set_routes } from '../../Routes';
interface ScenarioHeaderProps {
  children?: React.ReactNode;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onReset: () => void;
}

const ScenarioHeader: React.FC<ScenarioHeaderProps> = ({ 
    children, 
    isSidebarOpen, 
    setIsSidebarOpen,
    onReset
}) => {
  const navigate = useNavigate(); 

  return (
    <>
      <div className={`scenarios-chat-header ${isSidebarOpen ? 'sidebar-open' : ''}`}> 
        <div className="scenarios-chat-title-logo" onClick={() => navigate(set_routes.SCENARIO_CHAT)}>
          <span className="brand-text-scenario">Scenario-Chat</span>
        </div>
        <UserSetDropdown currentPage="/scenario" />
      </div>
      <div className={`new-main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default ScenarioHeader;