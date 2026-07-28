import React from 'react';
import { Dumbbell } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true,
  size = 'md' 
}) => {
  const sizeMap = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  };

  const textMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`inline-flex items-center gap-3 cursor-pointer select-none group ${className}`}>
      <div className={`relative flex items-center justify-center ${sizeMap[size]} rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-700 text-black font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 group-hover:shadow-emerald-500/40 transition-all duration-300 border border-emerald-300/40`}>
        <Dumbbell className="w-1/2 h-1/2 stroke-[2.5]" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-heading font-black tracking-wider uppercase ${textMap[size]} text-white group-hover:text-emerald-400 transition-colors`}>
            COACH <span className="text-emerald-500">BODA</span>
          </span>
          <span className="text-[10px] tracking-[0.25em] text-gray-400 font-semibold uppercase -mt-1">
            Fitness & Bodybuilding
          </span>
        </div>
      )}
    </div>
  );
};
