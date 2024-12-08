import React from 'react';
import { Slider, Typography } from '@mui/material';
import '../../css/Scenario/Scenarios.css';
import '../../css/Scenario/DifficultyFilter.css';

interface DifficultyFilterProps {
  selectedDifficulty: number | null;
  onDifficultyChange: (difficulty: number | null) => void;
}

const DifficultyFilter: React.FC<DifficultyFilterProps> = ({ selectedDifficulty, onDifficultyChange }) => {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    onDifficultyChange(newValue === 0 ? null : (newValue as number)); // 0일 경우 null로 설정
  };

  return (
    <div className="difficulty-filter">
      <Typography variant="h6" gutterBottom>난이도 선택</Typography>
      <Slider
        value={selectedDifficulty !== null ? selectedDifficulty : 0} // 기본값을 0으로 설정하여 "모든 난이도"로 시작
        onChange={handleSliderChange}
        aria-labelledby="difficulty-slider"
        min={0}
        max={3}
        step={1} 
        marks={[
          { value: 0, label: '모든 난이도' },
          { value: 1, label: '쉬움' },
          { value: 2, label: '중간' },
          { value: 3, label: '어려움' },
        ]}
      />
    </div>
  );
};

export default DifficultyFilter;