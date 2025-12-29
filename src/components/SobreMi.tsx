'use client';

import React from 'react';
import { Award, Globe, Mic } from 'lucide-react';
import { theme } from '@/constants/theme';

export const SobreMi: React.FC = () => {
  return (
    <section id="sobre-mi" className="py-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div 
        className="absolute top-1/2 left-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] -z-10 pointer-events-none"
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-[3/4] rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden shadow-2xl border-2 border-white/10 relative group">
            <img 
              src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop" 
              alt="Mujer Cantando" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Decorative graphic */}
          <div className="absolute -bottom-10 -left-10 text-9xl font-black text-white/5 select-none -z-10">VOZ</div>

          {/* Floating Badge */}
          <div className="absolute bottom-10 -right-6 bg-[#1a1a2e] p-4 rounded-xl border border-white/10 shadow-xl flex items-center gap-3 animate-bounce-slow z-20">
             <div className="p-2 rounded-full bg-white/5">
                <Mic size={24} style={{ color: theme.colors.secondary }} />
             </div>
             <div>
                <p className="text-xs text-gray-400">Coach</p>
                <p className="text-sm font-bold text-white">Certificada</p>
             </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Más que una profesora,<br/> tu <span style={{ color: theme.colors.secondary }}>entrenadora vocal</span>.
          </h2>
          <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              Hola. Soy cantante profesional y coach vocal certificada. Mi misión es simple: ayudarte a derribar las barreras que te impiden expresarte libremente.
            </p>
            <p>
              Creo firmemente que &quot;cantar bien&quot; no es solo afinar. Es tener la confianza para pararse en un escenario (o frente a un espejo) y dejar salir lo que llevás dentro. Mi método combina la rigurosidad técnica con la libertad creativa.
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-8 border-t border-white/5 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white shrink-0">
                    <Award size={24} style={{ color: theme.colors.secondary }} />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">10+</span>
                  <span className="text-sm text-gray-400">Años de experiencia</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white shrink-0">
                    <Globe size={24} style={{ color: theme.colors.secondary }} />
                </div>
                <div>
                  <span className="block text-2xl font-bold text-white">Online</span>
                  <span className="text-sm text-gray-400">& Presencial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

