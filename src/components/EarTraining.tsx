'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, CheckCircle2, XCircle, RotateCcw, Award, Info, HelpCircle } from 'lucide-react';
import { theme } from '@/constants/theme';

type GameStage = 'idle' | 'playing' | 'result';

interface IntervalOption {
  id: string;
  name: string;
  semitones: number;
  description: string;
  example: string;
}

const intervalOptions: IntervalOption[] = [
  { id: 'unison', name: 'Unísono', semitones: 0, description: 'Las dos notas son idénticas.', example: 'Jingle Bells (notas de "Jin-gle")' },
  { id: 'second', name: 'Segunda Mayor', semitones: 2, description: 'Paso de escala básico, tensión suave.', example: 'Noche de Paz ("No-che")' },
  { id: 'third', name: 'Tercera Mayor', semitones: 4, description: 'Distancia alegre, base de acordes mayores.', example: 'Oh When the Saints ("Oh, when") o Himno Nacional Argentino (comienzo)' },
  { id: 'fourth', name: 'Cuarta Justa', semitones: 5, description: 'Sonido de marcha o llamado, muy estable.', example: 'Arroz con leche ("A-rroz") o Marcha Nupcial' },
  { id: 'fifth', name: 'Quinta Justa', semitones: 7, description: 'Muy consonante y hueca, suena heroica.', example: 'Star Wars o Superman' },
  { id: 'octave', name: 'Octava', semitones: 12, description: 'La misma nota en un registro más agudo.', example: 'Somewhere Over the Rainbow ("Some-where")' }
];


export const EarTraining: React.FC = () => {
  const [stage, setStage] = useState<GameStage>('idle');
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<{
    base: number;
    target: number;
    correctOption: IntervalOption;
    options: IntervalOption[];
  } | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isPlayingNotes, setIsPlayingNotes] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);

  const playMidi = (midi: number, duration = 0.6, delay = 0) => {
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

      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
      
      osc.type = 'sine'; // clean sine wave

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.05); // smooth attack
      gain.gain.setValueAtTime(0.12, ctx.currentTime + delay + duration - 0.1);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + delay + duration); // smooth release

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    } catch (e) {
      console.error(e);
    }
  };

  const playSuccess = () => {
    playMidi(60, 0.12, 0);
    playMidi(64, 0.12, 0.1);
    playMidi(67, 0.12, 0.2);
    playMidi(72, 0.25, 0.3);
  };

  const playFailure = () => {
    playMidi(62, 0.2, 0);
    playMidi(61, 0.35, 0.15);
  };

  // Generate a random question
  const generateQuestion = () => {
    // Pick a random base note around C4 (midi 55 to 65)
    const base = Math.floor(Math.random() * 11) + 55;
    
    // Pick a random interval option
    const correctOption = intervalOptions[Math.floor(Math.random() * intervalOptions.length)];
    const target = base + correctOption.semitones;

    // We shuffle options (or just use the static list)
    // To keep it simple, we show all 5 possible options so the user always has the same list
    setCurrentQuestion({
      base,
      target,
      correctOption,
      options: intervalOptions
    });
    setSelectedId(null);
    setHasGuessed(false);
  };

  const startTest = () => {
    setStage('playing');
    setRound(1);
    setScore(0);
    setCurrentQuestion(null);
    setSelectedId(null);
    setHasGuessed(false);
  };

  useEffect(() => {
    if (stage === 'playing' && round === 1 && !currentQuestion) {
      generateQuestion();
    }
  }, [stage, round, currentQuestion]);

  const playIntervalNotes = () => {
    if (!currentQuestion || isPlayingNotes) return;
    setIsPlayingNotes(true);
    
    // Play reference note
    playMidi(currentQuestion.base, 0.6, 0);
    // Play interval note
    playMidi(currentQuestion.target, 0.6, 0.7);

    setTimeout(() => {
      setIsPlayingNotes(false);
    }, 1400);
  };

  // Auto-play interval when a new question is loaded
  useEffect(() => {
    if (currentQuestion && !hasGuessed) {
      const timer = setTimeout(() => {
        playIntervalNotes();
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleSelectOption = (id: string) => {
    if (hasGuessed) return;
    setSelectedId(id);
  };

  const handleSubmit = () => {
    if (!currentQuestion || !selectedId || hasGuessed) return;

    const correct = selectedId === currentQuestion.correctOption.id;
    setHasGuessed(true);
    
    if (correct) {
      setScore(s => s + 1);
      playSuccess();
    } else {
      playFailure();
    }
  };

  const handleNext = () => {
    if (round < 5) {
      setRound(r => r + 1);
      generateQuestion();
    } else {
      setStage('result');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Quiz Area */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-start min-h-[440px]">
          
          {/* Title inside card for dashboard alignment */}
          {stage !== 'result' && (
            <div className="w-full mb-8 text-center border-b border-white/10 pb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">Entrenamiento Auditivo</h2>
              <p className="text-sm text-gray-400 mt-2">Escucha dos notas y adivina el intervalo musical entre ellas.</p>
            </div>
          )}
          
          {stage === 'idle' && (
            <div className="text-center py-8 max-w-xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8 animate-pulse">
                <Volume2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Entrena tu Oído Musical</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 font-normal">
                Afinar la voz comienza por afinar el oído. En este ejercicio escucharemos dos tonos consecutivos. Tu meta es identificar el intervalo (la distancia) entre ellos. ¡Jugaremos una ronda de 5 preguntas!
              </p>
              <button 
                onClick={startTest}
                className="px-10 py-5 rounded-full font-bold text-lg text-primary transition-all transform hover:scale-105 shadow-xl hover:shadow-[0_0_30px_rgba(236,150,164,0.3)]"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                Comenzar Entrenamiento
              </button>
            </div>
          )}

          {stage === 'playing' && currentQuestion && (
            <div className="flex flex-col h-full">
              
              {/* Top status */}
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Pregunta {round} de 5
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Aciertos: {score}
                </span>
              </div>

              {/* Play Button Panel */}
              <div className="flex flex-col items-center justify-center py-6 mb-8 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden">
                <button
                  onClick={playIntervalNotes}
                  disabled={isPlayingNotes}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white border transition-all ${
                    isPlayingNotes 
                      ? 'bg-purple-500/10 border-purple-500/20 animate-pulse cursor-not-allowed'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105 shadow-lg'
                  }`}
                >
                  <Volume2 size={32} className={isPlayingNotes ? 'animate-bounce' : ''} />
                </button>
                
                <span className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">
                  {isPlayingNotes ? 'Reproduciendo notas...' : 'Haz clic para escuchar el intervalo'}
                </span>
              </div>

              {/* Options Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedId === opt.id;
                  const isCorrectAnswer = opt.id === currentQuestion.correctOption.id;
                  
                  let buttonStyle = 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10';
                  
                  if (hasGuessed) {
                    if (isCorrectAnswer) {
                      buttonStyle = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 font-bold';
                    } else if (isSelected) {
                      buttonStyle = 'bg-rose-500/10 border-rose-500/20 text-rose-400 line-through';
                    } else {
                      buttonStyle = 'bg-white/5 border-transparent text-gray-500 opacity-60';
                    }
                  } else if (isSelected) {
                    buttonStyle = 'bg-purple-500/20 border-purple-500/30 text-white font-bold';
                  }

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      disabled={hasGuessed}
                      className={`p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between ${buttonStyle}`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{opt.name}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-medium">{opt.description}</span>
                        <span className="text-[9px] text-[#EC96A4] mt-1 font-semibold">Ej: {opt.example}</span>
                      </div>
                      {hasGuessed && isCorrectAnswer && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
                      {hasGuessed && isSelected && !isCorrectAnswer && <XCircle size={16} className="text-rose-400 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Submit / Next Button */}
              <div className="flex justify-end">
                {!hasGuessed ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedId}
                    className={`px-8 py-3.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 ${
                      !selectedId
                        ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                        : 'text-primary'
                    }`}
                    style={{ backgroundColor: !selectedId ? 'transparent' : theme.colors.secondary }}
                  >
                    Confirmar Respuesta
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3.5 rounded-full font-bold text-sm text-primary transition-all transform hover:scale-105"
                    style={{ backgroundColor: theme.colors.secondary }}
                  >
                    {round < 5 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                  </button>
                )}
              </div>

            </div>
          )}

          {stage === 'result' && (
            <div className="text-center py-6 max-w-xl mx-auto flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-8 animate-pulse">
                <Award size={36} />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Ronda Finalizada!</h3>
              <p className="text-gray-400 text-sm mb-8">Completaste las 5 preguntas del test auditivo.</p>
              
              {/* Score visualizer */}
              <div className="bg-white/5 border border-white/10 rounded-2xl px-10 py-6 mb-10 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Tu Puntuación</span>
                <span className="text-5xl font-black mt-2" style={{ color: theme.colors.secondary }}>{score} / 5</span>
                <span className="text-xs text-gray-300 font-medium mt-2">
                  {score === 5 ? '¡Oído absoluto! Puntuación perfecta' : 
                   score >= 3 ? '¡Muy bien! Tienes buen oído musical' : 
                   '¡Sigue practicando para afilar tu entonación!'}
                </span>
              </div>

              <button 
                onClick={startTest}
                className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all hover:scale-105"
              >
                <RotateCcw size={16} /> Entrenar de Nuevo
              </button>
            </div>
          )}

        </div>

        {/* Sidebar Info Card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Interval cheatsheet */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle size={18} style={{ color: theme.colors.secondary }} />
              Guía Rápida de Intervalos
            </h3>
            
            <div className="flex flex-col gap-3 text-xs">
              {intervalOptions.map((opt) => (
                <div key={opt.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col gap-1">
                  <strong className="text-white block">
                    {opt.name} ({opt.semitones} {opt.semitones === 1 ? 'semitono' : 'semitonos'})
                  </strong>
                  <span className="text-gray-400">{opt.description}</span>
                  <span className="text-[10px] text-[#EC96A4] font-bold mt-1">
                    🎵 Ejemplo: {opt.example}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip Box */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Info size={16} style={{ color: theme.colors.secondary }} />
              Consejo de Oído
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Si te cuesta diferenciar el intervalo, intenta **cantar mentalmente** o tararear las dos notas después de escucharlas. Conectar tu oído con tus cuerdas vocales hace que el cerebro procese e identifique la distancia de forma mucho más rápida.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
