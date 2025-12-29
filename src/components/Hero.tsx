'use client';

import React, { useState } from 'react';
import { User, Play, Mic, Music } from 'lucide-react';
import { theme } from '@/constants/theme';

interface HeroProps {
  onNavigate: (id: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [heroImageError, setHeroImageError] = useState(false);

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" 
          style={{ backgroundColor: theme.colors.secondary }}
        ></div>
        <div 
          className="absolute bottom-20 right-40 w-72 h-72 rounded-full blur-3xl" 
          style={{ backgroundColor: '#2a2a40' }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Cupos disponibles para este mes
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Descubrí tu <br />
            <span 
              className="text-transparent bg-clip-text" 
              style={{ backgroundImage: `linear-gradient(to right, ${theme.colors.secondary}, #F7B5C1)` }}
            >
              Verdadera Voz
            </span>
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-lg leading-relaxed">
            Técnica vocal moderna, interpretación y coaching para cantantes que quieren dejar huella. Tu instrumento es único, aprendé a usarlo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              className="px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all transform hover:-translate-y-1"
              style={{ 
                backgroundColor: theme.colors.secondary, 
                color: 'white', 
                boxShadow: `0 10px 25px -5px ${theme.colors.secondary}50` 
              }}
            >
              Empezar Ahora
            </button>
            <button 
              onClick={() => onNavigate('metodo')}
              className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              Cómo trabajo
            </button>
          </div>
          
          <div className="pt-8 flex items-center gap-4 opacity-60">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-700 flex items-center justify-center text-xs"
                >
                  <User size={16} />
                </div>
              ))}
            </div>
            <p className="text-sm">+200 alumnos formados</p>
          </div>
        </div>

        <div className="relative h-[600px] hidden md:block">
          {/* Creative Image Composition */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Main Photo Container */}
            <div className="w-80 h-[500px] rounded-[2rem] overflow-hidden relative z-20 border-4 border-white/10 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 bg-gray-800">
              
              {!heroImageError ? (
                <img 
                  src="https://images.pexels.com/photos/3775131/pexels-photo-3775131.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Vocal Coach" 
                  className="w-full h-full object-cover"
                  onError={() => setHeroImageError(true)}
                />
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center relative p-6 text-center" 
                  style={{ background: `linear-gradient(135deg, ${theme.colors.tertiary}, ${theme.colors.primary})` }}
                >
                  <div 
                    className="w-32 h-32 rounded-full flex items-center justify-center mb-6 relative animate-pulse" 
                    style={{ backgroundColor: 'rgba(236, 150, 164, 0.2)' }}
                  >
                    <Mic size={64} style={{ color: theme.colors.secondary }} />
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-spin-slow"></div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Tu Voz</h3>
                  <p className="text-sm text-gray-400">Potencia tu talento</p>
                  
                  {/* Ondas decorativas */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-1 pb-4 opacity-50">
                    {[40, 60, 30, 80, 50, 90, 40, 60].map((h, i) => (
                      <div 
                        key={i} 
                        className="w-2 rounded-full animate-music-bar" 
                        style={{ 
                          height: `${h}%`, 
                          backgroundColor: theme.colors.secondary, 
                          animationDelay: `${i * 0.1}s` 
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-none">
                <p className="font-bold text-white">Tu Vocal Coach</p>
                <p className="text-sm text-gray-300">Entrenamiento Profesional</p>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div 
              className="absolute top-20 right-20 w-64 h-64 border-2 border-dashed rounded-full z-10 animate-spin-slow" 
              style={{ borderColor: `${theme.colors.secondary}50` }}
            ></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full opacity-20 blur-xl"></div>
            
            {/* Floating Badge */}
            <div className="absolute top-1/4 right-10 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 z-30 shadow-xl animate-bounce-slow">
              <Music className="w-8 h-8 mb-2" style={{ color: theme.colors.secondary }} />
              <p className="text-xs font-bold">Técnica<br/>Mixta</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

