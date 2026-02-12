import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div
      className={`
        glass-panel rounded-2xl p-6 
        transition-all duration-500 ease-in-out
        ${hoverEffect ? 'hover:scale-[1.02] hover:bg-white/10 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;