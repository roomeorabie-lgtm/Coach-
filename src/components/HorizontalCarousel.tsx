import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HorizontalCarouselProps {
  children: React.ReactNode;
  className?: string;
  itemGap?: string;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  children,
  className = '',
  itemGap = 'gap-6'
}) => {
  const { language } = useApp();
  const isRtl = language === 'ar';
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    
    if (isRtl) {
      // In RTL, scrollLeft is usually negative or inverted in browsers
      const maxScroll = scrollWidth - clientWidth;
      const currentScroll = Math.abs(scrollLeft);
      setCanScrollLeft(currentScroll < maxScroll - 5);
      setCanScrollRight(currentScroll > 5);
    } else {
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [children, isRtl]);

  const scrollBy = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    
    let multiplier = direction === 'right' ? 1 : -1;
    if (isRtl) {
      multiplier = direction === 'right' ? -1 : 1;
    }

    scrollRef.current.scrollBy({
      left: scrollAmount * multiplier,
      behavior: 'smooth'
    });
  };

  // Mouse Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed factor
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scrollBy('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-emerald-500 text-black shadow-2xl flex items-center justify-center -ml-4 hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200 glow-emerald ${
            isDragging ? 'pointer-events-none opacity-0' : 'opacity-90 hover:opacity-100'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex ${itemGap} overflow-x-auto no-scrollbar py-4 px-1 snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none`}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scrollBy('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-emerald-500 text-black shadow-2xl flex items-center justify-center -mr-4 hover:bg-emerald-400 hover:scale-110 active:scale-95 transition-all duration-200 glow-emerald ${
            isDragging ? 'pointer-events-none opacity-0' : 'opacity-90 hover:opacity-100'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      )}
    </div>
  );
};
