'use client';

import React from 'react';
import Link from 'next/link';
import { Mic, Wind, Music, Volume2, ArrowRight } from 'lucide-react';
import { theme } from '@/constants/theme';

export const SalaEnsayoPreview: React.FC = () => {
  const tools = [
    {
      id: 'tuner',
      icon: <Mic size={24} style={{ color: theme.colors.secondary }} />,
      title: 'Afinador de Voz',
      desc: 'Comprueba la precisión de tu afinación al instante cantando frente al micrófono.',
      status: 'active',
      statusText: 'Disponible'
    },
    {
      id: 'breathing',
      icon: <Wind size={24} className="text-blue-300" />,
      title: 'Control de Respiración',
      desc: 'Ejercicios con guías visuales y temporizadores para entrenar el soporte del aire.',
      status: 'active',
      statusText: 'Disponible'
    },
    {
      id: 'range',
      icon: <Music size={24} style={{ color: theme.colors.success }} />,
      title: 'Test de Rango Vocal',
      desc: 'Encuentra tus notas límites (graves y agudas) y descubre tu tipo de voz.',
      status: 'active',
      statusText: 'Disponible'
    },
    {
      id: 'ear',
      icon: <Volume2 size={24} className="text-purple-300" />,
      title: 'Entrenamiento de Oído',
      desc: 'Ejercicios auditivos interactivos para mejorar tu entonación e intervalos.',
      status: 'active',
      statusText: 'Disponible'
    }
  ];

  return (
    <section id="sala-de-ensayo" className="py-24 relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: theme.colors.secondary }}></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full blur-[150px] opacity-10" style={{ backgroundColor: theme.colors.success }}></div>

      <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide mb-6">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span className="text-gray-300 font-medium">Nuevo Espacio</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Sala de Ensayo <span style={{ color: theme.colors.secondary }}>Virtual</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Un espacio interactivo diseñado para que entrenes tu voz de forma autónoma. Practica afinación, respiración y técnica vocal con herramientas gratuitas directamente desde tu navegador.
          </p>
        </div>

        {/* Grid of Tools Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tools.map((tool, index) => (
            <Link 
              key={index} 
              href={`/sala-de-ensayo?tool=${tool.id}`}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:translate-y-[-4px] text-left cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  {tool.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {tool.desc}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span 
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    tool.status === 'active' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-white/5 text-gray-400 border border-white/5'
                  }`}
                >
                  {tool.statusText}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <Link 
            href="/sala-de-ensayo"
            className="group flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg text-primary transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-[0_0_30px_rgba(236,150,164,0.3)]"
            style={{ backgroundColor: theme.colors.secondary }}
          >
            Ingresar a la Sala de Ensayo
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
