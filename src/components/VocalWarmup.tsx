'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Settings2, RefreshCw, ChevronDown, Music } from 'lucide-react';
import { theme } from '@/constants/theme';
import { audioEngine } from '@/lib/audio/AudioEngine';
import { 
  WARMUP_PATTERNS, 
  generateWarmupSequence, 
  NoteEvent, 
  getNoteFromMidi,
  WarmupPatternId
} from '@/lib/audio/warmupSequencer';
import { useWarmupPitchDetection } from '@/hooks/useWarmupPitchDetection';

type GameState = 'idle' | 'playing' | 'finished';

const VIEWPORT_SECONDS = 3; // How many seconds of future notes to show

const CustomSelect = ({ value, options, onChange }: { value: any, options: {value: any, label: string}[], onChange: (val: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find(o => o.value == value)?.label;

  return (
    <div className="relative" onBlur={(e) => {
      // Close if clicking outside the component
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 cursor-pointer flex justify-between items-center transition-all shadow-inner"
      >
        <span className="truncate pr-4">{selectedLabel}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#2D2D44] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto">
            {options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); }} // Prevent blur before click fires
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className={`w-full text-left px-4 py-3 transition-colors hover:bg-white/10 ${opt.value == value ? 'bg-white/5 text-[#EC96A4] font-bold' : 'text-gray-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const VocalWarmup: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [patternId, setPatternId] = useState<WarmupPatternId>('escala_5');
  const [startMidi, setStartMidi] = useState(60); // C4
  const [endMidi, setEndMidi] = useState(72); // C5
  const [bpm, setBpm] = useState(90);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    try {
      const savedRange = localStorage.getItem('vocalRange');
      if (savedRange) {
        const { lowestMidi, highestMidi } = JSON.parse(savedRange);
        if (lowestMidi && highestMidi) {
          // Usar el rango completo del usuario, dejando 1 semitono de margen de seguridad
          const maxInterval = Math.max(...WARMUP_PATTERNS[patternId].pattern);
          const recommendedStart = Math.min(lowestMidi + 1, highestMidi - maxInterval);
          const recommendedEnd = Math.max(highestMidi - 1, recommendedStart + maxInterval);
          
          setStartMidi(recommendedStart);
          setEndMidi(recommendedEnd);
          setHasProfile(true);
        }
      }
    } catch (e) {
      console.error('No se pudo leer el rango vocal', e);
    }
  }, []);
  
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eventsRef = useRef<NoteEvent[]>([]);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  // Score tracking
  const scoreStats = useRef({ totalFrames: 0, hitFrames: 0 });

  // Pitch detection
  const isRecording = gameState === 'playing';
  const { pitchData, stopRecording } = useWarmupPitchDetection(isRecording);
  
  // Keep the latest pitch data in a ref for the animation loop
  const currentPitchRef = useRef(pitchData);
  const pitchHistoryRef = useRef<{time: number, exactMidi: number}[]>([]);
  const yAxisBoundsRef = useRef({ minMidi: 60, maxMidi: 72 });
  
  useEffect(() => {
    currentPitchRef.current = pitchData;
  }, [pitchData]);

  const startExercise = (overridePatternId?: WarmupPatternId) => {
    audioEngine.init();
    audioEngine.resume();
    
    const targetPattern = overridePatternId || patternId;
    let events = generateWarmupSequence(targetPattern, startMidi, endMidi, bpm);

    // Si los límites son tan estrictos que ni siquiera entra una pasada, forzamos una pasada
    if (events.length === 0) {
      const patternData = WARMUP_PATTERNS[targetPattern];
      const maxInterval = Math.max(...patternData.pattern);
      events = generateWarmupSequence(targetPattern, startMidi, startMidi + maxInterval, bpm);
    }
    
    eventsRef.current = events;
    
    // Compute Y-axis bounds once for the entire exercise
    let localMin = 200, localMax = 0;
    events.forEach(ev => {
      if (!ev.isRest) {
        if (ev.midiNote < localMin) localMin = ev.midiNote;
        if (ev.midiNote > localMax) localMax = ev.midiNote;
      }
    });
    if (localMax - localMin < 12) {
      const diff = 12 - (localMax - localMin);
      localMin -= Math.floor(diff / 2);
      localMax += Math.ceil(diff / 2);
    }
    yAxisBoundsRef.current = { minMidi: localMin, maxMidi: localMax };
    
    // Play the audio
    const now = audioEngine.getCurrentTime();
    startTimeRef.current = now + 0.5; // Start in 0.5s
    
    // Play the reference note immediately (first note of the pattern)
    if (events.length > 0) {
      audioEngine.playPianoNote(events[0].frequency, startTimeRef.current, 1.0);
    }

    events.forEach(ev => {
      if (!ev.isRest) {
        audioEngine.playPianoNote(ev.frequency, startTimeRef.current + ev.startTime, ev.duration);
      }
    });

    scoreStats.current = { totalFrames: 0, hitFrames: 0 };
    pitchHistoryRef.current = [];
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    return () => {
      audioEngine.stopAll();
    };
  }, []);

  const stopExercise = () => {
    setGameState('idle');
    audioEngine.stopAll();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };

  useEffect(() => {
    if (gameState === 'playing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const draw = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        
        // Hacer el canvas responsivo adaptando su resolución interna a la pantalla real
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const currentTime = audioEngine.getCurrentTime() - startTimeRef.current;
        const events = eventsRef.current;
        
        // Find if we are done
        const lastEvent = events[events.length - 1];
        if (lastEvent && currentTime > lastEvent.startTime + lastEvent.duration + 1) {
          setGameState('finished');
          audioEngine.stopAll();
          const finalScore = scoreStats.current.totalFrames > 0 
            ? Math.round((scoreStats.current.hitFrames / scoreStats.current.totalFrames) * 100) 
            : 0;
          setScore(finalScore);
          return; // Stop animating
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Find active and visible events
        // Find visible events
        const visibleEvents = events.filter(ev => 
          !ev.isRest && 
          ev.startTime < currentTime + VIEWPORT_SECONDS && 
          ev.startTime + ev.duration > currentTime - 0.5
        );

        // Use optimized FIXED Y-axis range
        const minMidi = yAxisBoundsRef.current.minMidi;
        const maxMidi = yAxisBoundsRef.current.maxMidi;
        const midiRange = maxMidi - minMidi + 4; // Add 2 semitones padding top and bottom
        
        // Draw horizontal staff lines
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        for (let m = minMidi - 2; m <= maxMidi + 2; m++) {
          const y = canvas.height - ((m - (minMidi - 2)) / midiRange) * canvas.height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
          
          // Draw note name on the left axis
          const isStart = m === startMidi;
          const isEnd = m === endMidi;

          if (isStart || isEnd) {
            ctx.fillStyle = isStart ? theme.colors.secondary : theme.colors.success;
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(`${isStart ? 'Inicio' : 'Fin'}: ${getNoteFromMidi(m)}`, 5, y - 5);
          } else if (m % 2 === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '10px sans-serif';
            ctx.fillText(getNoteFromMidi(m), 5, y - 5);
          }
        }

        // Posición dinámica de la línea de hit para modo celular
        const hitTargetLineX = Math.min(150, canvas.width * 0.25); 
        const pixelsPerSecond = (canvas.width - hitTargetLineX) / VIEWPORT_SECONDS;

        const activeNote = visibleEvents.find(ev => 
          currentTime >= ev.startTime && currentTime <= ev.startTime + ev.duration
        );

        // Draw active notes as floating blocks (Optimized, no text)
        visibleEvents.forEach(ev => {
          if (ev.isRest) return;
          
          const startX = hitTargetLineX + (ev.startTime - currentTime) * pixelsPerSecond;
          const width = ev.duration * pixelsPerSecond;
          const y = canvas.height - ((ev.midiNote - (minMidi - 2)) / midiRange) * canvas.height;
          
          const isActive = currentTime >= ev.startTime && currentTime <= ev.startTime + ev.duration;

          ctx.fillStyle = isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.2)';
          ctx.beginPath();
          ctx.roundRect(startX, y - 10, width, 20, 10);
          ctx.fill();
        });

        // Draw the hit target line (the "Now" line)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(hitTargetLineX, 0);
        ctx.lineTo(hitTargetLineX, canvas.height);
        ctx.stroke();
        
        // Draw glowing dot on the target line if active
        if (activeNote) {
          const y = canvas.height - ((activeNote.midiNote - (minMidi - 2)) / midiRange) * canvas.height;
          ctx.beginPath();
          ctx.arc(hitTargetLineX, y, 12, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(78, 168, 222, 0.4)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(hitTargetLineX, y, 6, 0, Math.PI * 2);
          ctx.fillStyle = '#4EA8DE';
          ctx.fill();
        }

        // --- Pitch tracing & Scoring ---
        const userPitch = currentPitchRef.current;
        let exactMidi = userPitch ? userPitch.noteNumber + (userPitch.cents / 100) : 0;
        
        // Completely ignore any pitch that falls outside the fixed exercise bounds (+/- 2 semitones padding)
        const isPitchValid = userPitch && exactMidi >= minMidi - 2 && exactMidi <= maxMidi + 2;

        if (isPitchValid) {
          const lastPoint = pitchHistoryRef.current[pitchHistoryRef.current.length - 1];

          const referenceMidi = activeNote ? activeNote.midiNote : (lastPoint ? lastPoint.exactMidi : exactMidi);

          // 1. Fold all Octaves (even 2 or 3 octaves away)
          let diff = exactMidi - referenceMidi;
          const octaveFolds = Math.round(diff / 12);
          if (Math.abs(diff - octaveFolds * 12) < 2.5 && octaveFolds !== 0) {
              exactMidi -= octaveFolds * 12;
          }
          // 2. Fold Perfect Fifths
          diff = exactMidi - referenceMidi;
          if (Math.abs(diff) >= 6.5 && Math.abs(diff) <= 7.5) {
              exactMidi -= Math.sign(diff) * 7;
          }

          // PHYSICAL SLEW RATE LIMITER
          const LATENCY_COMPENSATION = 0.12; 
          const compensatedTime = currentTime - LATENCY_COMPENSATION;
          
          if (lastPoint && compensatedTime - lastPoint.time < 0.1) {
             const frameDiff = exactMidi - lastPoint.exactMidi;
             const maxJump = 0.8; 
             
             if (frameDiff > maxJump) {
                 exactMidi = lastPoint.exactMidi + maxJump;
             } else if (frameDiff < -maxJump) {
                 exactMidi = lastPoint.exactMidi - maxJump;
             }
          }

          // LATENCY COMPENSATION: Record the exactMidi in the past
          pitchHistoryRef.current.push({ time: compensatedTime, exactMidi });

          // Scoring logic with PROPORTIONAL GRACE PERIOD
          if (activeNote) {
            // Grace period is 150ms OR 25% of the note duration (whichever is smaller)
            const gracePeriod = Math.min(0.15, activeNote.duration * 0.25);
            
            if (currentTime > activeNote.startTime + gracePeriod) {
              scoreStats.current.totalFrames++;
              const distance = Math.abs(exactMidi - activeNote.midiNote);
              if (distance <= 1.0) { 
                scoreStats.current.hitFrames++;
              }
            }
          }
        } else if (activeNote) {
          // Missed frame because no sound
          const gracePeriod = Math.min(0.15, activeNote.duration * 0.25);
          if (currentTime > activeNote.startTime + gracePeriod) {
            scoreStats.current.totalFrames++;
          }
        }

        // Clean up old history points that are outside the viewport
        const minVisibleTime = currentTime - (hitTargetLineX / pixelsPerSecond);
        pitchHistoryRef.current = pitchHistoryRef.current.filter(p => p.time > minVisibleTime);

        // Draw the pitch history trail
        if (pitchHistoryRef.current.length > 0) {
          ctx.beginPath();
          ctx.lineWidth = 8;
          ctx.strokeStyle = '#E76F51';
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          let isFirst = true;
          let lastT = 0;
          
          for (const pt of pitchHistoryRef.current) {
            const x = hitTargetLineX + (pt.time - currentTime) * pixelsPerSecond;
            const y = canvas.height - ((pt.exactMidi - (minMidi - 2)) / midiRange) * canvas.height;

            // Break the line if there's a big gap (e.g. mic drop or silence)
            if (!isFirst && (pt.time - lastT > 0.15)) {
              ctx.stroke();
              ctx.beginPath();
              isFirst = true;
            }

            if (isFirst) {
              ctx.moveTo(x, y);
              isFirst = false;
            } else {
              ctx.lineTo(x, y);
            }
            lastT = pt.time;
          }
          ctx.stroke();

          // Draw a glowing dot at the current leading edge
          const lastPoint = pitchHistoryRef.current[pitchHistoryRef.current.length - 1];
          // Only draw leading dot if it's very recent
          if (currentTime - lastPoint.time < 0.2) {
            const leadX = hitTargetLineX; // Anchor to the "Now" line instantly
            const leadY = canvas.height - ((lastPoint.exactMidi - (minMidi - 2)) / midiRange) * canvas.height;
            
            // Smooth connector from the delayed history tail to the instant leading dot
            const historicalX = hitTargetLineX + (lastPoint.time - currentTime) * pixelsPerSecond;
            ctx.beginPath();
            ctx.moveTo(historicalX, leadY);
            ctx.lineTo(leadX, leadY);
            ctx.strokeStyle = '#E76F51';
            ctx.lineWidth = 8;
            ctx.stroke();

            // Check if they are currently hitting the active note
            let isHitting = false;
            if (activeNote) {
                isHitting = Math.abs(lastPoint.exactMidi - activeNote.midiNote) <= 1.0;
            }

            ctx.fillStyle = isHitting ? theme.colors.success : '#E76F51';
            ctx.beginPath();
            ctx.arc(leadX, leadY, isHitting ? 10 : 8, 0, Math.PI * 2);
            ctx.fill();
            
            if (isHitting) {
              ctx.strokeStyle = theme.colors.success;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.arc(leadX, leadY, 16, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }

        animationFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    }
    
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, startMidi]);


  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
      
      {gameState === 'idle' && (
        <div className="flex flex-col gap-6 animate-fade-in">
          <div className="text-center mb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Vocalizaciones</h2>
            <p className="text-gray-400 mb-4">Configura tu rutina de calentamiento.</p>
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 px-4 py-2 rounded-lg text-sm">
              <span className="font-bold">⚠️ Recomendación:</span> Usa auriculares para que el micrófono no capte el sonido del piano.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Ejercicio</label>
                <CustomSelect 
                  value={patternId}
                  onChange={(val) => {
                    const newPattern = val as WarmupPatternId;
                    setPatternId(newPattern);
                    const maxInterval = Math.max(...WARMUP_PATTERNS[newPattern].pattern);
                    if (endMidi < startMidi + maxInterval) {
                      setEndMidi(startMidi + maxInterval);
                    }
                  }}
                  options={Object.entries(WARMUP_PATTERNS).map(([id, p]) => ({ value: id, label: p.name }))}
                />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <label className="block text-sm font-semibold text-gray-300 mb-3">Velocidad (BPM): {bpm}</label>
              <input 
                type="range" 
                min="60" max="100" step="5" 
                value={bpm} onChange={e => setBpm(Number(e.target.value))}
                className="w-full accent-[#4EA8DE] cursor-pointer mt-2"
              />
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 md:col-span-2">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-300">Rango Vocal</label>
                {hasProfile && (
                  <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    ✨ Calibrado según tu Test de Rango
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block mb-1">Iniciar en (Grave)</span>
                  <CustomSelect 
                    value={startMidi}
                    onChange={(val) => {
                      const newStart = Number(val);
                      setStartMidi(newStart);
                      
                      const maxInterval = Math.max(...WARMUP_PATTERNS[patternId].pattern);
                      if (endMidi < newStart + maxInterval || endMidi > newStart + 24) {
                        setEndMidi(newStart + Math.max(12, maxInterval));
                      }
                    }}
                    options={Array.from({length: 30}, (_, i) => 45 + i).map(m => ({ value: m, label: getNoteFromMidi(m) }))}
                  />
                </div>
                <div className="flex-1">
                  <span className="text-xs text-gray-500 block mb-1">Terminar en (Agudo)</span>
                  <CustomSelect 
                    value={endMidi}
                    onChange={(val) => setEndMidi(Number(val))}
                    options={Array.from({length: 25}, (_, i) => {
                      const maxInterval = Math.max(...WARMUP_PATTERNS[patternId].pattern);
                      return startMidi + maxInterval + i;
                    }).map(m => ({ value: m, label: getNoteFromMidi(m) }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => startExercise()}
            className="mt-4 w-full py-4 bg-white text-[#1A1A2E] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Play size={20} fill="currentColor" /> Iniciar Calentamiento
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col animate-fade-in h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">{WARMUP_PATTERNS[patternId].name}</h3>
            <button 
              onClick={stopExercise}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
            >
              <Square size={20} />
            </button>
          </div>
          
          <div className="flex-1 bg-black/40 rounded-2xl overflow-hidden border border-white/10 relative">
             <canvas 
               ref={canvasRef} 
               width={800} 
               height={400} 
               className="w-full h-full object-cover"
             />
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex flex-col animate-fade-in items-center text-center mt-8">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <Music size={32} className="text-emerald-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">¡Ejercicio Completado!</h2>
          
          <div className="w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center mb-8"
               style={{ borderColor: score > 70 ? theme.colors.success : '#F4A261' }}>
            <span className="text-4xl font-black" style={{ color: score > 70 ? theme.colors.success : '#F4A261' }}>
              {score}%
            </span>
            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">Precisión</span>
          </div>

          <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            <button 
              onClick={() => {
                const patternKeys = Object.keys(WARMUP_PATTERNS) as WarmupPatternId[];
                const currentIndex = patternKeys.indexOf(patternId);
                const nextPattern = patternKeys[(currentIndex + 1) % patternKeys.length];
                setPatternId(nextPattern);
                startExercise(nextPattern);
              }}
              className="py-3 px-6 bg-[#4EA8DE] text-white rounded-xl font-bold hover:bg-[#4EA8DE]/80 transition-colors"
            >
              Siguiente Ejercicio
            </button>
            <button 
              onClick={() => startExercise()}
              className="py-3 px-6 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Repetir este ejercicio
            </button>
            <button 
              onClick={() => window.location.href = '?tool=tuner'}
              className="py-3 px-6 bg-purple-500/20 text-purple-300 rounded-xl font-bold hover:bg-purple-500/30 transition-colors"
            >
              Siguiente Módulo: Afinador →
            </button>
            <div className="flex justify-center mt-6">
            <button 
              onClick={() => setGameState('idle')}
              className="text-gray-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <Settings2 size={16} />
              Elegir otro ejercicio manual
            </button>
          </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
