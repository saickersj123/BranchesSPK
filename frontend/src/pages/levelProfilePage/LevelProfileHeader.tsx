import React from 'react';
import logo from '../../img/branch_BL.png';
import '../../css/levelProfilePage/levelProfilePageHeader.css';
const LevelProfileHeader = () => {
  return (
    <div className='level-profile-header-logo'>
      <img src={logo} alt="Logo" />
    </div>
  );
};

export default LevelProfileHeader;