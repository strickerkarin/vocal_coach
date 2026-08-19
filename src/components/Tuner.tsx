'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, CheckCircle, Music, Play, Volume2 } from 'lucide-react';
import { theme } from '@/constants/theme';
import { usePitchDetection } from '@/hooks/usePitchDetection';

interface TunerProps {
  viewMode?: 'section' | 'card';
}

const tunerExercises = [
  { note: 'Do4', midi: 60, name: 'Do4 (C4)', description: 'La nota central de referencia (261 Hz). Ideal para empezar.' },
  { note: 'La3', midi: 57, name: 'La3 (A3)', description: 'Un tono de frecuencia media cómodo para calentar la voz (220 Hz).' },
  { note: 'Mi4', midi: 64, name: 'Mi4 (E4)', description: 'Tono brillante y alto (329 Hz). Requiere mayor soporte abdominal.' },
  { note: 'Sol4', midi: 67, name: 'Sol4 (G4)', description: 'Tono agudo desafiante (392 Hz). Usa tu resonancia de cabeza.' },
];

const notesGuide = [
  { cipher: 'C', latin: 'DO', color: '#4EA8DE' },
  { cipher: 'D', latin: 'RE', color: '#94D2BD' },
  { cipher: 'E', latin: 'MI', color: '#E9C46A' },
  { cipher: 'F', latin: 'FA', color: '#F4A261' },
  { cipher: 'G', latin: 'SOL', color: '#E76F51' },
  { cipher: 'A', latin: 'LA', color: '#EC96A4' },
  { cipher: 'B', latin: 'SI', color: '#A0A0B0' },
];

export const Tuner: React.FC<TunerProps> = ({ viewMode = 'section' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const pitchData = usePitchDetection(isRecording);

  const [tunerMode, setTunerMode] = useState<'free' | 'exercise'>('free');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const [pitch, setPitch] = useState(0); // -50 to 50 cents
  const [note, setNote] = useState('-');
  const [feedback, setFeedback] = useState('Canta una nota...');
  const [feedbackColor, setFeedbackColor] = useState<string>(theme.colors.accent);

  const latestPitchDataRef = useRef<any>(null);

  useEffect(() => {
    latestPitchDataRef.current = pitchData;
  }, [pitchData]);

  // Monitor pitch inputs in real-time
  useEffect(() => {
    if (!isRecording) {
      setPitch(0);
      setNote('-');
      setFeedback('Canta una nota...');
      setFeedbackColor(theme.colors.accent);
      return;
    }

    if (pitchData) {
      setPitch(pitchData.cents);
      setNote(pitchData.note);

      if (tunerMode === 'free') {
        if (Math.abs(pitchData.cents) < 15) {
          setFeedback('¡Afinación exacta!');
          setFeedbackColor(theme.colors.success);
        } else if (pitchData.cents > 0) {
          setFeedback('Ligeramente agudo (Sharp)');
          setFeedbackColor('#FFD166');
        } else {
          setFeedback('Ligeramente grave (Flat)');
          setFeedbackColor('#EF476F');
        }
      } else {
        const target = tunerExercises[currentExerciseIndex];
        if (pitchData.noteNumber === target.midi) {
          if (Math.abs(pitchData.cents) <= 22) {
            setFeedback('¡Perfecto! Mantén la nota...');
            setFeedbackColor(theme.colors.success);
          } else if (pitchData.cents > 0) {
            setFeedback('Un poco alto, baja un poco');
            setFeedbackColor('#FFD166');
          } else {
            setFeedback('Un poco bajo, sube más');
            setFeedbackColor('#EF476F');
          }
        } else if (pitchData.noteNumber < target.midi) {
          setFeedback('¡Más agudo! Sube la voz');
          setFeedbackColor('#EF476F');
        } else {
          setFeedback('¡Más grave! Baja la voz');
          setFeedbackColor('#FFD166');
        }
      }
    } else {
      setPitch(0);
      setNote('-');
      setFeedback('Canta una nota...');
      setFeedbackColor(theme.colors.accent);
    }
  }, [pitchData, isRecording, tunerMode, currentExerciseIndex]);

  // Monitor exercise hold progress with a smooth accumulator tick loop
  useEffect(() => {
    if (tunerMode === 'free' || !isRecording || exerciseCompleted) {
      setHoldProgress(0);
      return;
    }

    const intervalId = setInterval(() => {
      const target = tunerExercises[currentExerciseIndex];
      const currentPitchData = latestPitchDataRef.current;

      if (currentPitchData) {
        const isTargetNote = currentPitchData.noteNumber === target.midi;
        const isTuned = Math.abs(currentPitchData.cents) <= 22;

        if (isTargetNote && isTuned) {
          // Increase progress: +2% per 30ms tick (~1.5s total to 100%)
          setHoldProgress((prev) => {
            const next = prev + 2;
            if (next >= 100) {
              setExerciseCompleted(true);
              playSuccessChime();
              return 100;
            }
            return next;
          });
        } else {
          // Out of tune / wrong note: decay progress slowly (-2.5% per tick)
          setHoldProgress((prev) => Math.max(0, prev - 2.5));
        }
      } else {
        // Silent / low clarity: decay progress (-3.5% per tick)
        setHoldProgress((prev) => Math.max(0, prev - 3.5));
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [tunerMode, isRecording, currentExerciseIndex, exerciseCompleted]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Reset exercise progress
    setHoldProgress(0);
    setExerciseCompleted(false);
  };

  const playReference = (midi: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.0);
      
      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 1.0);
    } catch (e) {
      console.error(e);
    }
  };

  const playSuccessChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (midi: number, delay: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        const frequency = 440 * Math.pow(2, (midi - 69) / 12);
        osc.frequency.setValueAtTime(frequency, audioCtx.currentTime + delay);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + delay + 0.05);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + delay + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playTone(60, 0, 0.15);
      playTone(64, 0.1, 0.15);
      playTone(67, 0.2, 0.15);
      playTone(72, 0.3, 0.35);
    } catch (e) {
      console.error(e);
    }
  };

  const getNeedlePosition = () => {
    if (!isRecording || !pitchData) return 50;

    if (tunerMode === 'free') {
      return 50 + pitch;
    } else {
      const target = tunerExercises[currentExerciseIndex];
      if (pitchData.noteNumber === target.midi) {
        return 50 + pitch;
      } else if (pitchData.noteNumber < target.midi) {
        return 10; // far flat
      } else {
        return 90; // far sharp
      }
    }
  };

  const renderInnerCard = () => {
    return (
      <div className="flex flex-col md:flex-row gap-6 lg:gap-8 w-full items-stretch">
        {/* Left Column: Tuner Controls & Visualizer */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Mode Selector Tabs */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-8 w-full max-w-xs mx-auto border border-white/5">
              <button
                onClick={() => {
                  setTunerMode('free');
                  setExerciseCompleted(false);
                  setHoldProgress(0);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  tunerMode === 'free'
                    ? 'bg-[#EC96A4]/20 text-white border border-[#EC96A4]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Libre
              </button>
              <button
                onClick={() => {
                  setTunerMode('exercise');
                  setExerciseCompleted(false);
                  setHoldProgress(0);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  tunerMode === 'exercise'
                    ? 'bg-[#EC96A4]/20 text-white border border-[#EC96A4]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Ejercicios
              </button>
            </div>

            {/* Free Mode Layout */}
            {tunerMode === 'free' && (
              <div className="flex flex-col items-center justify-center mb-8">
                <p className="text-gray-400 font-medium mb-1 uppercase tracking-widest text-xs">Nota Cantada</p>
                <h3 className="text-6xl md:text-8xl font-black text-white drop-shadow-lg">{note}</h3>
                <p className="mt-4 text-lg font-medium transition-colors duration-300" style={{ color: feedbackColor }}>
                  {feedback}
                </p>
              </div>
            )}

            {/* Exercise Mode Layout */}
            {tunerMode === 'exercise' && (
              <div className="mb-6 w-full">
                {/* Exercise note buttons */}
                <div className="flex gap-2 justify-center mb-6 overflow-x-auto pb-2">
                  {tunerExercises.map((ex, idx) => (
                    <button
                      key={ex.name}
                      onClick={() => {
                        setCurrentExerciseIndex(idx);
                        setExerciseCompleted(false);
                        setHoldProgress(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        currentExerciseIndex === idx
                          ? 'bg-[#EC96A4]/20 border-[#EC96A4]/40 text-white'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {ex.note}
                    </button>
                  ))}
                </div>

                {/* Exercise target details */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center mb-6 relative overflow-hidden">
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Nota Objetivo</p>
                  <h4 className="text-3xl font-black text-[#EC96A4]">{tunerExercises[currentExerciseIndex].name}</h4>
                  <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto">{tunerExercises[currentExerciseIndex].description}</p>
                  
                  <button
                    onClick={() => playReference(tunerExercises[currentExerciseIndex].midi)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-full text-xs text-white font-bold transition-all"
                  >
                    <Volume2 size={14} className="text-[#EC96A4]" /> Escuchar Referencia
                  </button>
                </div>

                {/* Current status display */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Nota Detectada</p>
                  <h3 className="text-5xl font-black text-white">{note}</h3>
                  
                  <p className="mt-3 text-sm font-medium transition-colors duration-300" style={{ color: feedbackColor }}>
                    {feedback}
                  </p>
                </div>

                {/* Progress bar */}
                {isRecording && !exerciseCompleted && (
                  <div className="w-full bg-white/5 border border-white/5 rounded-xl p-3 mb-6">
                    <div className="flex justify-between text-[9px] text-gray-400 mb-1.5 font-bold uppercase tracking-wider">
                      <span>Sostén la afinación (1.5s)...</span>
                      <span>{Math.round(holdProgress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] transition-all duration-100"
                        style={{ width: `${holdProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Exercise Completed Banner */}
                {exerciseCompleted && (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center mb-6">
                    <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle size={16} /> ¡Excelente! Nota Afinada
                    </p>
                    <button
                      onClick={() => {
                        const nextIdx = (currentExerciseIndex + 1) % tunerExercises.length;
                        setCurrentExerciseIndex(nextIdx);
                        setExerciseCompleted(false);
                        setHoldProgress(0);
                      }}
                      className="mt-2 text-xs font-bold text-[#EC96A4] hover:underline"
                    >
                      Siguiente Ejercicio →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Gauge / Meter Concept */}
            <div className="w-full mb-8">
              <div className="relative w-full h-10 flex items-center mb-2">
                {/* Bar */}
                <div className="w-full h-4 bg-gray-800 rounded-full relative overflow-hidden flex shadow-inner">
                  {/* Gradient meter background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#EF476F] via-[#94D2BD] to-[#FFD166] opacity-85"></div>
                  
                  {/* Center marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10 transform -translate-x-1/2"></div>
                </div>

                {/* Moving Needle Indicator (Responsive: 150ms) */}
                <div 
                  className="absolute top-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 z-20 transition-[left] duration-150 ease-out transform -translate-x-1/2 -translate-y-1/2"
                  style={{ 
                    left: `${getNeedlePosition()}%`, 
                    borderColor: theme.colors.secondary 
                  }}
                ></div>
              </div>

              {/* Ticks and labels */}
              <div className="w-full flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">
                <span>Bajo (Flat)</span>
                <span>Afinado</span>
                <span>Alto (Sharp)</span>
              </div>
            </div>

            {/* Simulated Audio Waves */}
            <div className="flex items-end justify-center h-16 gap-1 mb-8 opacity-60">
              {[...Array(24)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-t-full transition-all duration-150 ${isRecording ? 'animate-music-bar' : 'h-1'}`}
                  style={{ 
                    backgroundColor: i % 2 === 0 ? theme.colors.secondary : theme.colors.success,
                    animationDelay: `${(i % 8) * 0.06}s`,
                    height: isRecording ? `${20 + (i % 6) * 12}%` : '4px'
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center">
            <button 
              onClick={toggleRecording}
              className={`flex items-center gap-3 px-10 py-4 rounded-full font-bold text-base transition-all transform hover:scale-105 shadow-xl ${
                isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_30px_rgba(239,71,111,0.4)]' : 'text-primary'
              }`}
              style={{ 
                backgroundColor: isRecording ? '#EF476F' : theme.colors.secondary,
              }}
            >
              {isRecording ? (
                <>
                  <Activity size={20} className="animate-pulse" />
                  Detener
                </>
              ) : (
                <>
                  <Mic size={20} />
                  Iniciar Micrófono
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Note Guide */}
        <div className="w-full md:w-52 shrink-0 bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-center">
          <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4 text-center border-b border-white/5 pb-2">
            Guía de Cifrado
          </h4>
          <div className="flex flex-col gap-2">
            {notesGuide.map((item) => {
              const isCurrent = isRecording && note.startsWith(item.cipher);
              return (
                <div
                  key={item.cipher}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-white/10 border-white/20 shadow-md scale-[1.02]'
                      : 'bg-transparent border-transparent opacity-65'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-transform duration-300 ${
                        isCurrent ? 'scale-110' : ''
                      }`}
                      style={{ 
                        backgroundColor: isCurrent ? item.color : 'rgba(255, 255, 255, 0.05)',
                        color: isCurrent ? '#1A1A2E' : item.color,
                        boxShadow: isCurrent ? `0 0 10px ${item.color}80` : 'none'
                      }}
                    >
                      {item.cipher}
                    </span>
                    <span className={`font-extrabold text-sm tracking-wide transition-colors ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                      {item.latin}
                    </span>
                  </div>
                  {isCurrent && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: item.color }}></span>
                      <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: item.color }}></span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (viewMode === 'card') {
    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-start">
        {/* Title inside card for dashboard alignment */}
        <div className="mb-8 text-center border-b border-white/10 pb-6 w-full">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Afinador de Voz</h2>
          <p className="text-sm text-gray-400 mt-2">Canta y comprueba tu afinación o intenta los desafíos guiados.</p>
        </div>
        {renderInnerCard()}
      </div>
    );
  }

  return (
    <section id="afinador" className="py-24 relative overflow-hidden" style={{ backgroundColor: theme.colors.primary }}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: theme.colors.secondary }}></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: theme.colors.success }}></div>

      <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide mb-6">
            <Music size={16} style={{ color: theme.colors.secondary }} />
            Herramienta Interactiva
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Prueba tu <span style={{ color: theme.colors.secondary }}>Afinación</span>
          </h2>
          <div className="text-xl text-gray-300 max-w-3xl mx-auto space-y-4">
            <p>
              Usa este afinador interactivo para comprobar la precisión de tu voz al instante. Es un recurso perfecto para vocalistas de cualquier nivel que busquen perfeccionar su entonación y agudizar el oído. Solo tienes que cantar frente al micrófono y la pantalla te indicará si estás dando en la nota exacta.
            </p>
            <p className="font-semibold text-white">
              ¡Entrena tu afinación y eleva la calidad de tu canto!
            </p>
          </div>
        </div>

        <div className="max-w-[760px] mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
          {renderInnerCard()}
        </div>
      </div>
    </section>
  );
};
