import React from 'react';
import { Modal } from 'react-bootstrap';
import { AIScenario } from '../../types'; 
import '../../css/Scenario/ScenarioModal.css';

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
      <Modal.Header closeButton>
        <div className="modal-title">{selectedScenario.name}</div>
      </Modal.Header>
      <Modal.Body>
        <p className="modal-description">{selectedScenario.description}</p>
        <div className="roles">
          <button 
            className={`role-button ${selectedRole === 'role1' ? 'selected' : ''}`}
            onClick={() => onRoleChange('role1')}
          >
            {selectedScenario.roles.role1}
          </button>
          <button 
            className={`role-button ${selectedRole === 'role2' ? 'selected' : ''}`}
            onClick={() => onRoleChange('role2')}
          >
            {selectedScenario.roles.role2}
          </button>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="footer-buttons">
          <button className="back-button" onClick={onHide}>닫기</button>
          <button className="start-button" onClick={onStart}>시작하기</button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ScenarioModal;