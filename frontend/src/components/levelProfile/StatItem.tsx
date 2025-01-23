// frontend/src/components/levelProfile/StatItem.tsx
import React from 'react';

interface StatItemProps {
    value: number;
    label: string;
    onClick?: () => void;
    isClickable?: boolean;
    children?: React.ReactNode;
}

const formatValue = (value: number): string => {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'm';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'k';
    }
    return value.toString();
};

const StatItem: React.FC<StatItemProps> = ({ value, label, onClick, isClickable, children }) => (
    <div 
        className={`stat-item ${isClickable ? 'clickable-stat' : ''}`} 
        onClick={onClick}
    >
        <div className="stat-value">{formatValue(value)}</div>
        <div className="stat-label">{label}</div>
        {children}
    </div>
);

export default StatItem;