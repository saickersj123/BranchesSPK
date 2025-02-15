import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AIScenario } from '../../@types/scenarios'; 
import '../../css/scenarioPage/ScenarioModal.css';
import GameList from './GameList';

interface ScenarioModalProps {
  show: boolean;
  selectedScenario: AIScenario | null;
  onHide: () => void;
  onStart: () => void;
  selectedRole: 'role1' | 'role2';
  onRoleChange: (role: 'role1' | 'role2') => void;
  selectedGame: string | null;
  onGameChange: (gameId: string) => void;
}

const ScenarioModal: React.FC<ScenarioModalProps> = ({
  show,
  selectedScenario,
  onHide,
  onStart,
  selectedRole,
  onRoleChange, 
  selectedGame,
  onGameChange,
}) => {
  const [showGameList, setShowGameList] = useState<boolean>(false);
  const [showGameConfirmation, setShowGameConfirmation] = useState<boolean>(false);

  if (!selectedScenario) return null;

  const handleRoleChange = (role: 'role1' | 'role2') => {
    onRoleChange(role);
  };

  const handleGameSelect = (gameId: string) => {
    onGameChange(gameId);
  }; 
  
  const handleGameConfirmationNo = () => {
    setShowGameConfirmation(false);
    setShowGameList(false);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{selectedScenario.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className={`ScenarioModal-Body ${showGameList ? 'ScenarioModal-Body--dimmed' : ''}`}>
        <p className="ScenarioModal-modal-description">{selectedScenario.description}</p>
        <div className="ScenarioModal-roles">
          <Button 
            variant={selectedRole === 'role1' ? 'primary' : 'secondary'} 
            onClick={() => handleRoleChange('role1')}
            className="ScenarioModal-role-button"
          >
            {selectedScenario.roles[0]}
          </Button>
          <Button 
            variant={selectedRole === 'role2' ? 'primary' : 'secondary'} 
            onClick={() => handleRoleChange('role2')}
            className="ScenarioModal-role-button"
          >
            {selectedScenario.roles[1]}
          </Button> 
        </div>  

        <p className="ScenarioModal-modal-description">게임을 선택하시겠습니까?</p> 
        <div className="ScenarioModal-roles">
          <Button 
            variant={showGameList ? 'primary' : 'secondary'} 
            onClick={() => setShowGameList(true)}
            className="ScenarioModal-role-button"
          >
            예
          </Button>
          <Button 
            variant={showGameList ? 'secondary' : 'primary'} 
            onClick={() => handleGameConfirmationNo()}
            className="ScenarioModal-role-button"
          >
            아니오
          </Button> 
        </div>   
        {showGameList && (
          <div className="ScenarioModal-game-list">
            <GameList onSelect={handleGameSelect} selectedGame={selectedGame} /> 
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="ScenarioModal-Footer">
        <Button variant="secondary" onClick={onHide} className="ScenarioModal-back-button">닫기</Button>
        <Button
          variant="primary"
          onClick={() => {
           // console.log('Start button clicked');
            onStart();
          }}
          className="ScenarioModal-start-button"
        >
          시작하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScenarioModal;