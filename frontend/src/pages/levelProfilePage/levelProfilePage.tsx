 
import LevelProfileBody from './levelProfileBody';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../css/levelProfilePage/levelProfilePage.css';
import '../../css/levelProfilePage/levelProfilePageHeader.css';
import logo from '../../img/branch_BL.png';

interface LocationState {
  from?: string;
}

const LevelProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const handleBackClick = () => {
    if (state && state.from) {
      navigate(state.from);
    } else {
      navigate('/service');
    }
  };

  return (
    <div className="level-profile-container">
      <div className="level-profile-header-container" >  
        <div className='level-profile-header-logo'>
          <img src={logo} alt="Logo" onClick={handleBackClick} />
        </div>
      </div>
      <div className="level-profile-body-container">
        <LevelProfileBody />
      </div>
    </div>
  );
};

export default LevelProfilePage;