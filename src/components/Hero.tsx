'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { User, Play, Mic, Music } from 'lucide-react';
import { theme } from '@/constants/theme';

interface HeroProps {
  onNavigate: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [heroImageError, setHeroImageError] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {!heroImageError ? (
          <Image 
            src="/hero-image.png"
            alt="Vocal Coach Background" 
            fill
            priority
            quality={100}
            className="object-cover object-[center_15%] sm:object-[center_20%]"
            onError={() => setHeroImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#1a1a2e]/90 z-10"></div>
      </div>

      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none z-10">
        <div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-[100px]" 
          style={{ backgroundColor: theme.colors.secondary }}
        ></div>
        <div 
          className="absolute bottom-20 left-40 w-72 h-72 rounded-full blur-[100px]" 
          style={{ backgroundColor: theme.colors.tertiary }}
        ></div>
      </div>

      <div className="max-w-[1000px] w-full mx-auto px-6 flex flex-col items-center text-center relative z-20 pt-32 md:pt-40">
        <div className="space-y-8 animate-fade-in-up flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] overflow-visible pb-4">
            <span className="block animate-sound-pulse text-white drop-shadow-lg" style={{ animationDelay: '0.1s' }}>
              Conectá con tu
            </span>
            <span 
              className="block text-transparent bg-clip-text animate-sound-pulse-delayed relative drop-shadow-2xl" 
              style={{ 
                backgroundImage: `linear-gradient(to right, #ffffff, ${theme.colors.secondary}, #F7B5C1, #ffffff)`,
                backgroundSize: '200% auto',
                animationDelay: '0.3s'
              }}
            >
              Propia Voz
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer pointer-events-none mix-blend-overlay"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl opacity-100 max-w-2xl leading-relaxed text-gray-200 drop-shadow-md font-medium">
            Tu voz es única y tiene un propósito. En mis clases te acompaño a descubrirla, desarrollarla y confiar en ella.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 pt-6 w-full sm:w-auto">
            <button 
              onClick={() => window.open(process.env.NEXT_PUBLIC_WHATSAPP_URL || '#', '_blank')}
              className="px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:-translate-y-1 hover:scale-105"
              style={{ 
                backgroundColor: theme.colors.secondary, 
                color: 'white', 
                boxShadow: `0 15px 30px -5px ${theme.colors.secondary}60` 
              }}
            >
              Empezar Ahora
            </button>
            <button 
              onClick={() => onNavigate('metodo')}
              className="px-10 py-4 rounded-full font-bold text-lg border border-white/30 bg-black/30 backdrop-blur-md hover:bg-white/20 transition-all flex items-center justify-center gap-2 text-white hover:scale-105"
            >
              <Play size={20} fill="currentColor" />
              Cómo trabajo
            </button>
          </div>
          
          <div className="pt-12 flex flex-col items-center gap-4 opacity-90">
            <div className="flex -space-x-4">
              {[1,2,3].map(i => (
                <div 
                  key={i} 
                  className="w-12 h-12 rounded-full border-2 border-gray-800 bg-gray-800 flex items-center justify-center text-xs shadow-xl relative overflow-hidden"
                >
                  <User size={20} className="text-gray-400" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
                </div>
              ))}
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase text-gray-300">Para todos los niveles</p>
          </div>
        </div>
      </div>
    </section>
  );
};

