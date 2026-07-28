import React, { useState } from 'react';
import { Transformation } from '../types';
import { ArrowRight, Trophy, Sliders } from 'lucide-react';

export const BeforeAfterCard: React.FC<{ transformation: Transformation }> = ({ transformation }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState<'slider' | 'side-by-side'>('slider');

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/10 glass-card-hover p-4 md:p-5 flex flex-col justify-between">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-extrabold text-lg md:text-xl text-white">
            {transformation.clientName}
          </h3>
          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5" />
            {transformation.duration || "12 Weeks Transformation"}
          </p>
        </div>

        {transformation.weightChange && (
          <span className="text-xs font-mono font-bold text-black bg-emerald-400 px-2.5 py-1 rounded-full shadow">
            {transformation.weightChange}
          </span>
        )}
      </div>

      {/* Mode Toggle Button */}
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setMode(mode === 'slider' ? 'side-by-side' : 'slider')}
          className="text-[11px] font-medium text-gray-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Sliders className="w-3 h-3" />
          Switch to {mode === 'slider' ? 'Side-by-Side' : 'Interactive Slider'}
        </button>
      </div>

      {/* Before / After Display Area */}
      {mode === 'slider' ? (
        <div 
          className="relative aspect-[4/3] w-full rounded-xl overflow-hidden select-none cursor-ew-resize border border-white/10 group"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
            const percent = (x / rect.width) * 100;
            setSliderPos(percent);
          }}
          onTouchMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const touch = e.touches[0];
            if (touch) {
              const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
              const percent = (x / rect.width) * 100;
              setSliderPos(percent);
            }
          }}
        >
          {/* After Image (Background) */}
          <img 
            src={transformation.afterImage || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"} 
            alt="After Transformation" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <span className="absolute top-3 right-3 text-[10px] uppercase font-black bg-emerald-500 text-black px-2 py-0.5 rounded shadow">
            AFTER
          </span>

          {/* Before Image (Foreground Clip) */}
          <div 
            className="absolute top-0 bottom-0 left-0 overflow-hidden border-r-2 border-emerald-400 shadow-2xl"
            style={{ width: `${sliderPos}%` }}
          >
            <img 
              src={transformation.beforeImage || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop"} 
              alt="Before Transformation" 
              className="absolute top-0 left-0 h-full max-w-none object-cover"
              style={{ width: '100%', height: '100%' }}
            />
            <span className="absolute top-3 left-3 text-[10px] uppercase font-black bg-black/80 text-white px-2 py-0.5 rounded border border-white/20">
              BEFORE
            </span>
          </div>

          {/* Slider Line handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_15px_#10b981]"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-lg font-bold text-xs">
              ↔
            </div>
          </div>
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-2 gap-2 aspect-[4/3] w-full rounded-xl overflow-hidden">
          <div className="relative h-full w-full">
            <img 
              src={transformation.beforeImage || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop"} 
              alt="Before" 
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute top-2 left-2 text-[9px] uppercase font-bold bg-black/80 text-white px-1.5 py-0.5 rounded">
              BEFORE
            </span>
          </div>
          <div className="relative h-full w-full">
            <img 
              src={transformation.afterImage || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop"} 
              alt="After" 
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute top-2 right-2 text-[9px] uppercase font-bold bg-emerald-500 text-black px-1.5 py-0.5 rounded">
              AFTER
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      <p className="mt-4 text-xs text-gray-300 leading-relaxed line-clamp-3">
        {transformation.description}
      </p>
    </div>
  );
};
