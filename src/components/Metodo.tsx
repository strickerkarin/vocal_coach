'use client';

import React from 'react';
import { Heart, Music, ArrowRight, CheckCircle2 } from 'lucide-react';
import { theme } from '@/constants/theme';

export const Metodo: React.FC = () => {
  return (
    <section id="metodo" className="py-20 px-6 bg-opacity-50 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 
            className="text-sm font-bold tracking-widest uppercase mb-2" 
            style={{ color: theme.colors.success }}
          >
            Mi Enfoque
          </h2>
          <h3 className="text-3xl md:text-5xl font-bold">
            No es solo cantar,<br/> es comunicar.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-[#EC96A4]/50 transition-all group">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform" 
              style={{ backgroundColor: theme.colors.tertiary }}
            >
              <Heart style={{ color: theme.colors.secondary }} />
            </div>
            <h4 className="text-xl font-bold mb-3">Salud Vocal</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Aprendé a usar tu voz sin fatiga ni daños. La técnica saludable es la base de cualquier artista duradero.
            </p>
          </div>

          {/* Card 2 (Featured) */}
          <div 
            className="p-8 rounded-3xl md:col-span-2 relative overflow-hidden group" 
            style={{ background: `linear-gradient(135deg, ${theme.colors.secondary}, #C06C84)` }}
          >
            <div className="relative z-10">
              <h4 className="text-2xl font-bold mb-4 text-white">Interpretación y Estilo</h4>
              <p className="text-white/90 text-lg max-w-md">
                Encontrá tu propio sonido. Trabajamos matices, dinámicas y conexión emocional para que cada canción sea tuya.
              </p>
              <button 
                className="mt-6 px-6 py-2 bg-white rounded-full font-bold text-sm hover:bg-gray-100 transition-colors flex items-center gap-2" 
                style={{ color: theme.colors.secondary }}
              >
                Ver más <ArrowRight size={16} />
              </button>
            </div>
            <Music className="absolute -bottom-4 -right-4 w-40 h-40 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
          </div>

          {/* Card 3 */}
          <div className="md:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:bg-white/10 transition-colors">
            <div className="flex-1">
              <h4 className="text-xl font-bold mb-3">Técnica Personalizada</h4>
              <p className="text-gray-400 text-sm mb-4">
                Cada voz es una huella digital. Diseño ejercicios específicos para tu registro y necesidades actuales.
              </p>
              <div className="flex gap-2 flex-wrap">
                {['Respiración', 'Apoyo', 'Resonancia', 'Articulación'].map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/3 h-32 bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
              <div className="flex items-end gap-1 h-16">
                {[40, 70, 50, 90, 60, 30, 80, 50].map((h, i) => (
                  <div 
                    key={i} 
                    className="w-3 rounded-full animate-music-bar" 
                    style={{ 
                      backgroundColor: theme.colors.secondary, 
                      height: `${h}%`, 
                      animationDelay: `${i * 0.1}s` 
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-green-400/50 transition-all">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" 
              style={{ backgroundColor: theme.colors.tertiary }}
            >
              <CheckCircle2 style={{ color: theme.colors.success }} />
            </div>
            <h4 className="text-xl font-bold mb-3">Resultados Reales</h4>
            <p className="text-gray-400 text-sm">
              Grabamos las clases para que monitorees tu progreso semana a semana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

