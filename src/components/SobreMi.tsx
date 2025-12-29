'use client';

import React from 'react';
import { theme } from '@/constants/theme';

export const SobreMi: React.FC = () => {
  return (
    <section id="sobre-mi" className="py-20 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        <div className="w-full md:w-1/2 relative">
          <div className="aspect-[3/4] rounded-tr-[5rem] rounded-bl-[5rem] overflow-hidden shadow-2xl border-2 border-white/10">
            <img 
              src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=800&auto=format&fit=crop" 
              alt="Mujer Cantando" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
            />
          </div>
          {/* Decorative graphic */}
          <div className="absolute -bottom-10 -left-10 text-9xl font-black text-white/5 select-none -z-10">VOZ</div>
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
            <div className="pt-6 border-t border-white/10 flex gap-8">
              <div>
                <span className="block text-3xl font-bold text-white">10+</span>
                <span className="text-sm text-gray-400">Años de experiencia</span>
              </div>
              <div>
                <span className="block text-3xl font-bold text-white">Online</span>
                <span className="text-sm text-gray-400">& Presencial</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

