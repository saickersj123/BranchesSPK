import LevelProfileHeader from './LevelProfileHeader';
import LevelProfileBody from './levelProfileBody';
import '../../css/levelProfilePage/levelProfilePage.css';
const LevelProfilePage = () => {
  return (
    <div className="level-profile-container">
      <div className="level-profile-header-container"> 
        <LevelProfileHeader />
      </div>
      <div className="level-profile-body-container">
        <LevelProfileBody />
      </div>
    </div>
  );
};

export default LevelProfilePage;