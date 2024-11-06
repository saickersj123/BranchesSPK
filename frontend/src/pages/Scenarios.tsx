import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllScenarios, startNewConversationWithScenario } from '../api/axiosInstance';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Modal, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/Scenarios.css';
import IMAGE_NOT_FOUND from '../img/ErrorIMG.png';
import { AIScenario } from '../types';

const DifficultyBar: React.FC<{ level: 1 | 2 | 3 }> = ({ level }) => {
  const bars = [
    { filled: level >= 1, label: '쉬움' },
    { filled: level >= 2, label: '중간' },
    { filled: level >= 3, label: '어려움' }
  ];

  return (
    <div className="difficulty-container">
      <div className="difficulty-bars">
        {bars.map((bar, index) => (
          <div 
            key={index} 
            className={`difficulty-bar ${bar.filled ? 'filled' : ''}`}
            data-label={bar.label}
          />
        ))}
      </div>
      <span className="difficulty-label">
        {level === 1 ? '쉬움' : level === 2 ? '중간' : '어려움'}
      </span>
    </div>
  );
};

const Scenarios: React.FC = () => {
  const [scenarios, setScenarios] = useState<AIScenario[]>([]);
  const [filteredScenarios, setFilteredScenarios] = useState<AIScenario[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<AIScenario | null>(null);
  const [selectedRole, setSelectedRole] = useState<'role1' | 'role2'>('role1');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getAllScenarios();
        const sortedData = [...data].sort((a, b) => a.difficulty - b.difficulty);
        setScenarios(sortedData);
        setFilteredScenarios(sortedData);
      } catch (error) {
        console.error('시나리오 목록을 불러오는데 실패했습니다:', error);
      }
    };
    fetchScenarios();
  }, []);

  const handleDifficultyFilter = (difficulty: number | null) => {
    setSelectedDifficulty(difficulty);
    if (difficulty === null) {
      setFilteredScenarios(scenarios);
    } else {
      setFilteredScenarios(scenarios.filter(scenario => scenario.difficulty === difficulty));
    }
  };

  const handleStartScenario = async () => {
    if (!selectedScenario) return;
    try {
      const conversation = await startNewConversationWithScenario(selectedScenario._id, selectedRole);
      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error('시나리오 시작에 실패했습니다:', error);
      alert('시나리오를 시작하는데 실패했습니다.');
    }
  };

  const handleScenarioClick = (scenario: AIScenario) => {
    setSelectedScenario(scenario);
    setShowModal(true);
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGE_NOT_FOUND;
  };

  return (
    <div className="scenarios-container">
      <button className="scenarios-back-button" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>
      <h1>시나리오 선택</h1>
      <div className="difficulty-filter">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-difficulty">
            <FontAwesomeIcon icon={faFilter} />
            {selectedDifficulty === null 
              ? ' 모든 난이도' 
              : selectedDifficulty === 1 
                ? ' 쉬움' 
                : selectedDifficulty === 2 
                  ? ' 중간' 
                  : ' 어려움'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleDifficultyFilter(null)}>
              모든 난이도
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDifficultyFilter(1)}>
              쉬움
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDifficultyFilter(2)}>
              중간
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDifficultyFilter(3)}>
              어려움
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="scenarios-grid">
        {filteredScenarios.map((scenario) => (
          <div key={scenario._id} className="scenario-card" onClick={() => handleScenarioClick(scenario)}>
            <div className="scenario-image">
              <img src={scenario.imageUrl || IMAGE_NOT_FOUND} alt={scenario.name} onError={handleImageError} />
            </div>
            <h2>{scenario.name}</h2>
            <DifficultyBar level={scenario.difficulty} />
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedScenario?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedScenario?.description}</p>
          <div className="roles">
            <button 
              className={`role-button ${selectedRole === 'role1' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('role1')}
            >
              {selectedScenario?.roles.role1}
            </button>
            <button 
              className={`role-button ${selectedRole === 'role2' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('role2')}
            >
              {selectedScenario?.roles.role2}
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button className="back-button" onClick={() => setShowModal(false)}>닫기</button>
          <button className="start-button" onClick={handleStartScenario}>시작하기</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Scenarios;
