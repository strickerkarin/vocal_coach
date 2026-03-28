'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '@/constants/theme';
import { testimonios } from '@/constants/testimonios';

export const Testimonios: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const scrollNode = scrollRef.current;
    if (scrollNode) {
      scrollNode.addEventListener('scroll', checkScroll);
      // Check initially and on window resize
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollNode.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="testimonios" className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4 fill-current" />
        <h2 className="text-3xl font-bold">Lo que dicen mis alumnos</h2>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-12">
        {/* Flecha Izquierda */}
        <button 
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm text-white transition-all transform hover:scale-110 border border-white/10 ${
            !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Ver anteriores"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Flecha Derecha */}
        <button 
          onClick={() => scroll('right')}
          className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-sm text-white transition-all transform hover:scale-110 border border-white/10 ${
            !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Ver siguientes"
        >
          <ChevronRight size={16} />
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonios.map((t, i) => (
            <div 
              key={i} 
              className="w-[85vw] md:w-[calc(33.333%-1rem)] flex-none snap-center bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors flex flex-col justify-between"
            >
              <p className="italic text-gray-300 mb-6">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                {t.image ? (
                  <div className="w-12 h-12 relative overflow-hidden rounded-full border-2 border-white/20 flex-shrink-0">
                    <Image 
                      src={t.image} 
                      alt={`Foto de ${t.name}`} 
                      fill 
                      className="object-cover"
                      style={t.imageStyle}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold text-white shadow-lg border-2 border-white/20" 
                    style={{ background: `linear-gradient(to bottom right, ${theme.colors.secondary}, purple)` }}
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
                <div className="text-left overflow-hidden">
                  <div className="font-bold text-sm truncate">{t.name}</div>
                  <div className="text-xs text-gray-400 truncate">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



