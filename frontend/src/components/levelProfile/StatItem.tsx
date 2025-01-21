// frontend/src/components/levelProfile/StatItem.tsx
import React from 'react';

interface StatItemProps {
    value: number;
    label: string;
    onClick?: () => void;
    isClickable?: boolean;
    children?: React.ReactNode;
}

const StatItem: React.FC<StatItemProps> = ({ value, label, onClick, isClickable, children }) => (
    <div 
        className={`stat-item ${isClickable ? 'clickable-stat' : ''}`} 
        onClick={onClick}
    >
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {children}
    </div>
);

export default StatItem;