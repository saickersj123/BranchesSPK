  
import React from 'react';
import '../../css/scenarioPage/DifficultyBar.css';

const DifficultyBar: React.FC<{ level: 1 | 2 | 3 }> = ({ level }) => {
  const bars = [
    { filled: level >= 1, label: '쉬움', color: 'green' }, // 쉬움
    { filled: level >= 2, label: '중간', color: 'yellow' }, // 중간
    { filled: level >= 3, label: '어려움', color: 'red' } // 어려움
  ];
  return (
    <div className="difficulty-container">
      <div className="difficulty-bars">
        {bars.map((bar, index) => (
          <div 
            key={index} 
            className={`difficulty-bar ${bar.filled ? 'filled' : ''}`}
            style={{ backgroundColor: bar.filled ? bar.color : 'transparent' }} // Apply color
            data-label={bar.label}
            aria-label={bar.label} // Added accessibility label
          />
        ))}
      </div>
      <span className="difficulty-label" aria-live="polite">
        {level === 1 ? '쉬움' : level === 2 ? '중간' : '어려움'}
      </span>
    </div>
  );
};

export default DifficultyBar;