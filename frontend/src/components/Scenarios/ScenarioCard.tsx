import React from 'react';
import { AIScenario } from '../../types';
import DifficultyBar from './DifficultyBar'; 
import '../../css/Scenario/Scenarios.css';

interface ScenarioCardProps {
  scenario: AIScenario;
  onClick: (scenario: AIScenario) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, onClick, onImageError }) => {
  return (
    <div className="scenario-card" onClick={() => onClick(scenario)}>
      <div className="scenario-image">
        <img src={scenario.imageUrl || require('../../img/ErrorIMG.png')} alt={scenario.name} onError={onImageError} />
      </div>
      <h2>{scenario.name}</h2>
      <DifficultyBar level={scenario.difficulty} />
    </div>
  );
};

export default ScenarioCard;
