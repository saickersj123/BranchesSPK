import React from 'react';
import '../../css/scenarioPage/ScenarioList.css';
import '../../css/scenarioPage/DifficultyFilter.css'; 

interface DifficultyFilterProps {
  selectedDifficulty: number | null;
  onDifficultyChange: (difficulty: number | null) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ selectedDifficulty, onDifficultyChange }) => {
  const difficultyLabels = ['모든 난이도', '쉬움', '중간', '어려움'];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    onDifficultyChange(value === 0 ? null : value);
  };

  return (
    <div className="level-difficulty-filter">
      <div className="level-difficulty-label"> </div> 
      <div className="level-dropdown-container">
        <select
          value={selectedDifficulty !== null ? selectedDifficulty : 0}
          onChange={handleChange}
          className="level-difficulty-dropdown"
        >
          {difficultyLabels.map((label, index) => (
            <option key={index} value={index}>
              {label}
            </option>
          ))}
        </select>
      </div> 
    </div>
  );
};

export default DifficultyFilter;