
import React from 'react';
import { RiskLevel } from '../types';
import { RISK_COLORS } from '../constants';

interface RiskBadgeProps {
  level: RiskLevel;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level }) => {
  const colorClass = RISK_COLORS[level] || RISK_COLORS.LOW;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
      {level}
    </span>
  );
};
