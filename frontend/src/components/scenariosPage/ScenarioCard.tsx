import React from 'react';
import { AIScenario } from '../../@types/scenarios';
import DifficultyBar from './DifficultyBar'; 
import '../../css/scenarioPage/Scenarios.css';
import IMAGE_NOT_FOUND from '../../img/ErrorIMG.png';

interface ScenarioCardProps {
  scenario: AIScenario;
  onClick: (scenario: AIScenario) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick, onImageError }) => {
  return (
    <div className="scenario-card" onClick={() => onClick(scenario)}>
      <div className="scenario-image">
        <img
          src={scenario.imageUrl || IMAGE_NOT_FOUND}
          alt={scenario.name}
          onError={onImageError}
        />
      </div>
      <h2>{scenario.name}</h2>
      <DifficultyBar level={scenario.difficulty} />
    </div>
  );
};

export default ScenarioCard;
