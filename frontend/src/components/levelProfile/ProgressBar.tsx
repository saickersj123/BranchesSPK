// frontend/src/components/levelProfile/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
    <div className="progress-bar">
        <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

export default ProgressBar;