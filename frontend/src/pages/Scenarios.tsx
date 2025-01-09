import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllScenarios, startNewConversationWithScenario } from '../api/AiChat';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../css/Scenario/Scenarios.css';
import '../css/set/color.css';  
import IMAGE_NOT_FOUND from '../img/ErrorIMG.png';
import { AIScenario } from '../@types/scenarios';
import DifficultyFilter from '../components/scenarios/DifficultyFilter'; // 추가된 부분
import ScenarioCard from '../components/scenarios/ScenarioCard'; // 추가된 부분
import ScenarioModal from '../components/scenarios/ScenarioModal'; // 추가된 부분
import { Button } from 'react-bootstrap'; // React Bootstrap의 Button 컴포넌트 추가

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
      const conversation = await startNewConversationWithScenario(selectedScenario._id, selectedRole, selectedScenario.game_id, selectedScenario.difficulty);
      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      console.error('시나리오 시작에 실패했습니다:', error);
      alert('시나리오를 시작하는데 실패했습니다.');
    }``
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
      <Button className="scenarios-backbutton" onClick={handleBack}>
        <FontAwesomeIcon icon={faArrowLeft} />
      </Button>
      <h1>시나리오 선택</h1> 
      <DifficultyFilter selectedDifficulty={selectedDifficulty} onDifficultyChange={handleDifficultyFilter} />  
      <div className="scenarios-grid">
        {filteredScenarios.length === 0 ? (
          <div className="scenarios-notfound">시나리오가 없습니다.</div>
        ) : (
          filteredScenarios.map((scenario) => (
            <ScenarioCard 
              key={scenario._id} 
              scenario={scenario} 
              onClick={handleScenarioClick} 
              onImageError={handleImageError}
            /> 
          ))
        )}
      </div>
      <ScenarioModal 
        show={showModal} 
        selectedScenario={selectedScenario} 
        onHide={() => setShowModal(false)} 
        onStart={handleStartScenario} 
        selectedRole={selectedRole} 
        onRoleChange={setSelectedRole} 
      />
    </div>
  );
};

export default Scenarios;