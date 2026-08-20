'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Info } from 'lucide-react';
import { theme } from '@/constants/theme';

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface Pattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  rest: number;
  description: string;
  exhaleTip: string;
}

const patterns: Pattern[] = [
  {
    name: 'Soporte Vocal (Recomendado)',
    inhale: 4,
    hold: 4,
    exhale: 8,
    rest: 2,
    description: 'Diseñado para vocalistas. Entrena la exhalación lenta y controlada del aire haciendo el sonido "Ssss" con los dientes casi juntos.',
    exhaleTip: 'Exhala soplando un "Sssss..." fino y continuo'
  },
  {
    name: 'Respiración Cuadrada (Relajación)',
    inhale: 4,
    hold: 4,
    exhale: 4,
    rest: 4,
    description: 'Equilibra el sistema nervioso, reduce la ansiedad antes de cantar y ayuda a expandir las costillas.',
    exhaleTip: 'Exhala vaciando el aire suavemente'
  },
  {
    name: 'Respiración Progresiva (Sustento)',
    inhale: 4,
    hold: 8,
    exhale: 12,
    rest: 2,
    description: 'Para cantantes intermedios y avanzados. Trabaja la dosificación extrema del apoyo y la fuerza diafragmática.',
    exhaleTip: 'Sssss... controla el apoyo del diafragma'
  }
];

export const BreathingExercise: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(patterns[0].inhale);
  const [cycleCount, setCycleCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activePattern = patterns[patternIndex];

  // Reset phase when pattern changes
  useEffect(() => {
    setIsPlaying(false);
    setPhase('inhale');
    setSecondsLeft(activePattern.inhale);
    setCycleCount(0);
  }, [patternIndex, activePattern]);

  const playClick = (frequency = 800) => {
    if (!soundEnabled) return;
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContextRef.current) audioContextRef.current = ctx;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle'; // Triangle wave for a warmer, less harsh metronome sound
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.error(e);
    }
  };

  // Keep refs updated to prevent stale closure bugs in setInterval
  const secondsLeftRef = useRef(secondsLeft);
  const phaseRef = useRef(phase);

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Timer interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const currentSecs = secondsLeftRef.current;
      const currentPhase = phaseRef.current;

      if (currentSecs <= 1) {
        // Switch to the next phase
        let nextPhase: BreathingPhase = 'inhale';
        let nextSecs = activePattern.inhale;

        if (currentPhase === 'inhale') {
          nextPhase = 'hold';
          nextSecs = activePattern.hold;
        } else if (currentPhase === 'hold') {
          nextPhase = 'exhale';
          nextSecs = activePattern.exhale;
        } else if (currentPhase === 'exhale') {
          nextPhase = 'rest';
          nextSecs = activePattern.rest;
          // Cycle finishes active exhalation: increment cycle count!
          // Safe from React Strict Mode double-invocations here.
          setCycleCount((c) => c + 1);
        } else if (currentPhase === 'rest') {
          nextPhase = 'inhale';
          nextSecs = activePattern.inhale;
        }

        setPhase(nextPhase);
        setSecondsLeft(nextSecs);
        playClick(1000); // Higher tone for transition
      } else {
        setSecondsLeft(currentSecs - 1);
        playClick(600); // Regular beat
      }
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, activePattern, soundEnabled]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase('inhale');
    setSecondsLeft(activePattern.inhale);
    setCycleCount(0);
  };

  // Get current color theme based on breathing phase
  const getPhaseData = () => {
    switch (phase) {
      case 'inhale':
        return {
          title: 'Inhala',
          subtitle: 'Llena los pulmones expandiendo las costillas bajas',
          color: '#4EA8DE',
          bgGlow: 'rgba(78, 168, 222, 0.25)',
          scale: activePattern.inhale > 1 
            ? 1.0 - ((secondsLeft - 1) / (activePattern.inhale - 1)) * 0.5 
            : 1.0
        };
      case 'hold':
        return {
          title: 'Mantén',
          subtitle: 'Sostén el aire sin tensar la garganta',
          color: '#94D2BD',
          bgGlow: 'rgba(148, 210, 189, 0.25)',
          scale: 1.0
        };
      case 'exhale':
        return {
          title: 'Exhala',
          subtitle: activePattern.exhaleTip,
          color: theme.colors.secondary,
          bgGlow: 'rgba(236, 150, 164, 0.25)',
          scale: activePattern.exhale > 1 
            ? 0.5 + ((secondsLeft - 1) / (activePattern.exhale - 1)) * 0.5 
            : 0.5
        };
      case 'rest':
        return {
          title: 'Pausa',
          subtitle: 'Relaja el abdomen por completo',
          color: '#A0A0B0',
          bgGlow: 'rgba(160, 160, 176, 0.1)',
          scale: 0.5
        };
    }
  };

  const phaseInfo = getPhaseData();

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Visualizer Card */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-start min-h-[480px]">
          
          {/* Title inside card for dashboard alignment */}
          <div className="w-full mb-8 text-center border-b border-white/10 pb-6 z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Control de Respiración</h2>
            <p className="text-sm text-gray-400 mt-2">Entrena tu capacidad y administración de aire con ciclos guiados.</p>
          </div>
          
          {/* Decorative Background */}
          <div 
            className="absolute transition-all duration-1000 rounded-full blur-[100px] w-80 h-80 opacity-40 z-0" 
            style={{ backgroundColor: phaseInfo.bgGlow }}
          ></div>

          {/* Sound Metronome Toggle */}
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all z-10"
            title={soundEnabled ? 'Silenciar Metrónomo' : 'Activar Metrónomo'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Breathing Visual Guide (Circle) */}
          <div className="relative w-72 h-72 flex items-center justify-center mb-10 z-10">
            {/* Outer pulsating ring */}
            <div 
              className="absolute inset-0 rounded-full border border-white/5 transition-transform duration-1000 ease-out"
              style={{ transform: `scale(${phaseInfo.scale * 1.15})` }}
            ></div>
            
            {/* Core breathing circle */}
            <div 
              className="w-56 h-56 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-out shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden border border-white/10"
              style={{ 
                transform: `scale(${phaseInfo.scale})`,
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                boxShadow: `0 0 40px ${phaseInfo.bgGlow}, inset 0 0 20px ${phaseInfo.bgGlow}`
              }}
            >
              <Wind size={40} className="mb-2 transition-colors duration-500" style={{ color: phaseInfo.color }} />
              <span className="text-4xl font-bold text-white tracking-wide transition-all duration-500">{phaseInfo.title}</span>
              <span className="text-2xl font-extrabold text-white mt-1">{secondsLeft}s</span>
            </div>
          </div>

          {/* Subtitle instructions */}
          <div className="text-center max-w-sm mb-10 min-h-[48px] z-10">
            <p className="text-white font-medium text-lg leading-snug">{phaseInfo.subtitle}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 z-10">
            <button 
              onClick={handleReset}
              className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300 hover:text-white transition-all transform hover:scale-105"
              title="Reiniciar ejercicio"
            >
              <RotateCcw size={20} />
            </button>

            <button 
              onClick={togglePlay}
              className="flex items-center justify-center w-20 h-20 rounded-full text-primary transition-all transform hover:scale-105 shadow-xl hover:shadow-[0_0_30px_rgba(236,150,164,0.3)]"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              {isPlaying ? <Pause size={32} className="ml-0" /> : <Play size={32} className="ml-1" />}
            </button>

            <div className="w-12 h-12 flex flex-col items-center justify-center rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Ciclos</span>
              <span className="text-lg font-bold text-white mt-1">{cycleCount}</span>
            </div>
          </div>

        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Select Pattern Card */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-lg font-bold text-white mb-6">Selecciona una Rutina</h3>
            
            <div className="flex flex-col gap-4">
              {patterns.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPatternIndex(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    patternIndex === idx
                      ? 'bg-white/10 border-white/20 shadow-lg'
                      : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-white text-base">{p.name}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300">
                      {p.inhale}-{p.hold}-{p.exhale}-{p.rest}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tip Box */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Info size={16} style={{ color: theme.colors.secondary }} />
              ¿Por qué es importante?
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              En el canto, la respiración no consiste en tomar la mayor cantidad de aire posible, sino en saber **dosificar y apoyar** la exhalación de forma constante y sin tensiones.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              La rutina de **Soporte Vocal (4-4-8-2)** entrena la resistencia diafragmática al duplicar el tiempo de exhalación respecto a la inhalación, imitando la presión que usas al cantar frases largas.
            </p>
          </div>
          
          {/* Navigation Button */}
          <button 
            onClick={() => window.location.href = '?tool=ear'}
            className="w-full py-4 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-2xl font-bold hover:bg-purple-500/30 transition-colors shadow-lg mt-2"
          >
            Siguiente Módulo: Entrenamiento Auditivo →
          </button>

        </div>

      </div>
    </div>
  );
};
