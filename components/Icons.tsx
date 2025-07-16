
import React from 'react';

export const MaterialIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => (
    <span className={`material-icons ${className}`}>{iconName}</span>
);
