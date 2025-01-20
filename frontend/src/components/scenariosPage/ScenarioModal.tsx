 
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { AIScenario } from '../../@types/scenarios'; 
import '../../css/scenarioPage/ScenarioModal.css';

interface ScenarioModalProps {
  show: boolean;
  selectedScenario: AIScenario | null;
  onHide: () => void;
  onStart: () => void;
  selectedRole: 'role1' | 'role2';
  onRoleChange: (role: 'role1' | 'role2') => void;
}

const ScenarioModal: React.FC<ScenarioModalProps> = ({
  show,
  selectedScenario,
  onHide,
  onStart,
  selectedRole,
  onRoleChange
}) => {
  if (!selectedScenario) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{selectedScenario.name}</Modal.Title>
      </Modal.Header >
      <Modal.Body className="ScenarioModal-Body">
        <p className="ScenarioModal-modal-description">{selectedScenario.description}</p>
        <div className="ScenarioModal-roles">
          <Button 
            variant={selectedRole === 'role1' ? 'primary' : 'secondary'} 
            onClick={() => onRoleChange('role1')}
            className="ScenarioModal-role-button"
          >
            {selectedScenario.roles.role1}
          </Button>
          <Button 
            variant={selectedRole === 'role2' ? 'primary' : 'secondary'} 
            onClick={() => onRoleChange('role2')}
            className="ScenarioModal-role-button"
          >
            {selectedScenario.roles.role2}
          </Button>
        </div>
      </Modal.Body>
      <Modal.Footer className="ScenarioModal-Footer">
        <Button variant="secondary" onClick={onHide} className="ScenarioModal-back-button">닫기</Button>
        <Button variant="primary" onClick={onStart} className="ScenarioModal-start-button">시작하기</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScenarioModal;