import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllScenarioList, startNewScenarioConversation, getGameList } from '../../api/AiScenariosChat';  
import '../../css/scenarioPage/ScenarioList.css';
import '../../css/set/color.css';  
import IMAGE_NOT_FOUND from '../../img/ErrorIMG.png';
import { AIScenario } from '../../@types/scenarios';
import DifficultyFilter from '../../components/scenariosPage/DifficultyFilter'; // 추가된 부분
import ScenarioCard from '../../components/scenariosPage/ScenarioCard'; // 추가된 부분
import ScenarioModal from '../../components/scenariosPage/ScenarioModal'; // 추가된 부분 
import NewSidebar from '../../components/newSidebar/NewSidebar';
import { set_routes } from '../../Routes';

interface ScenarioListProps {
  page: string; // Add a prop for the page to navigate to
}

const ScenarioList: React.FC<ScenarioListProps> = ({ page }) => {
  const [scenarios, setScenarios] = useState<AIScenario[]>([]);
  const [filteredScenarios, setFilteredScenarios] = useState<AIScenario[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<AIScenario | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<'role1' | 'role2'>('role1');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getAllScenarioList();
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
    console.log('handleStartScenario called'); // Debugging log
    if (!selectedScenario) {
      console.log('Scenario not selected'); // Debugging log
      return;
    }

    const gameId = selectedGame || '0'; // Default to '0' if no game is selected

    try {
      console.log('Starting scenario with game ID:', gameId); // Debugging log
      const conversation = await startNewScenarioConversation(
        selectedScenario._id,
        selectedRole,
        gameId, // Use the default or selected game ID
        selectedScenario.difficulty
      );
      if (typeof conversation === 'string') {
        console.log('Navigating to conversation:', conversation); // Debugging log
        navigate(`${set_routes.SCENARIO_CHAT}/${conversation}`);
      } else {
        throw new Error('Invalid conversation response');
      }
    } catch (error) {
      console.error('Failed to start scenario:', error);
      alert('시나리오를 시작하는데 실패했습니다.');
    }
  };

  const handleScenarioClick = (scenario: AIScenario) => {
    setSelectedScenario(scenario);
    setShowModal(true);
  }; 

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = IMAGE_NOT_FOUND;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  return (
    <div className="scenarios-container"> 
      <NewSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} /> 
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
        selectedGame={selectedGame} 
        onGameChange={setSelectedGame} 
      />
    </div>
  );
};

export default ScenarioList;