'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mic, Wind, Music, Volume2, ArrowLeft, Info } from 'lucide-react';
import { theme } from '@/constants/theme';
import { Tuner } from '@/components/Tuner';
import { BreathingExercise } from '@/components/BreathingExercise';
import { VocalRangeTest } from '@/components/VocalRangeTest';
import { EarTraining } from '@/components/EarTraining';
import { VocalWarmup } from '@/components/VocalWarmup';

type ActiveTool = 'tuner' | 'warmup' | 'breathing' | 'range' | 'ear';

function SalaDeEnsayoContent() {
  const [activeTool, setActiveTool] = useState<ActiveTool>('range');
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool') as ActiveTool;

  useEffect(() => {
    if (toolParam && ['tuner', 'warmup', 'breathing', 'range', 'ear'].includes(toolParam)) {
      setActiveTool(toolParam);
    }
  }, [toolParam]);

  const tools = [
    {
      id: 'range' as ActiveTool,
      label: 'Test de Rango Vocal',
      icon: <Music size={20} />,
      color: theme.colors.success
    },
    {
      id: 'warmup' as ActiveTool,
      label: 'Vocalizaciones',
      icon: <Music size={20} />,
      color: '#EC96A4'
    },
    {
      id: 'tuner' as ActiveTool,
      label: 'Afinador de Voz',
      icon: <Mic size={20} />,
      color: theme.colors.secondary
    },
    {
      id: 'breathing' as ActiveTool,
      label: 'Control de Respiración',
      icon: <Wind size={20} />,
      color: '#4EA8DE'
    },
    {
      id: 'ear' as ActiveTool,
      label: 'Entrenamiento Auditivo',
      icon: <Volume2 size={20} />,
      color: '#B5179E'
    }
  ];

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#EC96A4] selection:text-white flex flex-col" 
      style={{ backgroundColor: theme.colors.primary, color: theme.colors.accent }}
    >
      {/* Header */}
      <header className="border-b border-white/10 py-6 px-6 md:px-12 bg-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center text-white"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <span className="text-sm font-semibold tracking-wider text-gray-400 uppercase">Espacio Práctico</span>
              <h1 className="text-xl md:text-2xl font-bold text-white leading-none mt-1">Sala de Ensayo Virtual</h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Online y Gratis
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Selector */}
        <aside className="w-full lg:w-[320px] flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Ejercicios y Herramientas</h2>
            
            <nav className="flex flex-col gap-2">
              {tools.map((tool) => {
                const isActive = activeTool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-medium text-sm transition-all duration-300 text-left ${
                      isActive 
                        ? 'bg-white/10 border border-white/20 text-white shadow-lg shadow-black/10' 
                        : 'bg-transparent border border-transparent text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: isActive ? tool.color : 'rgba(255, 255, 255, 0.05)',
                          color: isActive ? '#1A1A2E' : tool.color
                        }}
                      >
                        {tool.icon}
                      </div>
                      <span>{tool.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Tip Box */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-6 hidden lg:block">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Info size={16} style={{ color: theme.colors.secondary }} />
              Consejo Vocal
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Recuerda realizar un precalentamiento vocal suave de 5 a 10 minutos antes de comenzar ejercicios intensos o de afinación. ¡Cuida tus cuerdas vocales!
            </p>
          </div>
        </aside>

        {/* Content Display Area */}
        <section className="flex-1 flex flex-col">
          {activeTool === 'tuner' && (
            <div className="animate-fade-in">
              <Tuner viewMode="card" />
            </div>
          )}

          {activeTool === 'warmup' && (
            <VocalWarmup />
          )}

          {activeTool === 'breathing' && (
            <BreathingExercise />
          )}

          {activeTool === 'range' && (
            <VocalRangeTest />
          )}

          {activeTool === 'ear' && (
            <EarTraining />
          )}
        </section>

      </main>
    </div>
  );
}

export default function SalaDeEnsayo() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A2E] text-white">
        <p className="animate-pulse">Cargando la Sala de Ensayo...</p>
      </div>
    }>
      <SalaDeEnsayoContent />
    </Suspense>
  );
}
