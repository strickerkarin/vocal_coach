'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Activity, RefreshCw, Music, CheckCircle, Info, Keyboard } from 'lucide-react';
import { theme } from '@/constants/theme';
import { usePitchDetection } from '@/hooks/usePitchDetection';

type TestStage = 'idle' | 'lowest' | 'highest' | 'result';

const midiNotes = [
  { midi: 36, name: 'Do2 (C2)', isBlack: false },
  { midi: 37, name: 'Do#2 (C#2)', isBlack: true },
  { midi: 38, name: 'Re2 (D2)', isBlack: false },
  { midi: 39, name: 'Re#2 (D#2)', isBlack: true },
  { midi: 40, name: 'Mi2 (E2)', isBlack: false },
  { midi: 41, name: 'Fa2 (F2)', isBlack: false },
  { midi: 42, name: 'Fa#2 (F#2)', isBlack: true },
  { midi: 43, name: 'Sol2 (G2)', isBlack: false },
  { midi: 44, name: 'Sol#2 (G#2)', isBlack: true },
  { midi: 45, name: 'La2 (A2)', isBlack: false },
  { midi: 46, name: 'La#2 (A#2)', isBlack: true },
  { midi: 47, name: 'Si2 (B2)', isBlack: false },

  { midi: 48, name: 'Do3 (C3)', isBlack: false },
  { midi: 49, name: 'Do#3 (C#3)', isBlack: true },
  { midi: 50, name: 'Re3 (D3)', isBlack: false },
  { midi: 51, name: 'Re#3 (D#3)', isBlack: true },
  { midi: 52, name: 'Mi3 (E3)', isBlack: false },
  { midi: 53, name: 'Fa3 (F3)', isBlack: false },
  { midi: 54, name: 'Fa#3 (F#3)', isBlack: true },
  { midi: 55, name: 'Sol3 (G3)', isBlack: false },
  { midi: 56, name: 'Sol#3 (G#3)', isBlack: true },
  { midi: 57, name: 'La3 (A3)', isBlack: false },
  { midi: 58, name: 'La#3 (A#3)', isBlack: true },
  { midi: 59, name: 'Si3 (B3)', isBlack: false },

  { midi: 60, name: 'Do4 (C4)', isBlack: false },
  { midi: 61, name: 'Do#4 (C#4)', isBlack: true },
  { midi: 62, name: 'Re4 (D4)', isBlack: false },
  { midi: 63, name: 'Re#4 (D#4)', isBlack: true },
  { midi: 64, name: 'Mi4 (E4)', isBlack: false },
  { midi: 65, name: 'Fa4 (F4)', isBlack: false },
  { midi: 66, name: 'Fa#4 (F#4)', isBlack: true },
  { midi: 67, name: 'Sol4 (G4)', isBlack: false },
  { midi: 68, name: 'Sol#4 (G#4)', isBlack: true },
  { midi: 69, name: 'La4 (A4)', isBlack: false },
  { midi: 70, name: 'La#4 (A#4)', isBlack: true },
  { midi: 71, name: 'Si4 (B4)', isBlack: false },

  { midi: 72, name: 'Do5 (C5)', isBlack: false },
  { midi: 73, name: 'Do#5 (C#5)', isBlack: true },
  { midi: 74, name: 'Re5 (D5)', isBlack: false },
  { midi: 75, name: 'Re#5 (D#5)', isBlack: true },
  { midi: 76, name: 'Mi5 (E5)', isBlack: false },
  { midi: 77, name: 'Fa5 (F5)', isBlack: false },
  { midi: 78, name: 'Fa#5 (F#5)', isBlack: true },
  { midi: 79, name: 'Sol5 (G5)', isBlack: false },
  { midi: 80, name: 'Sol#5 (G#5)', isBlack: true },
  { midi: 81, name: 'La5 (A5)', isBlack: false },
  { midi: 82, name: 'La#5 (A#5)', isBlack: true },
  { midi: 83, name: 'Si5 (B5)', isBlack: false },
  { midi: 84, name: 'Do6 (C6)', isBlack: false },
];

const totalWhiteKeys = midiNotes.filter(n => !n.isBlack).length; // 29 keys

const noteNamesSp = ["Do", "Do#", "Re", "Re#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
function formatMidiNoteName(midi: number): string {
  const note = noteNamesSp[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
}

function classifyVoice(lowMidi: number, highMidi: number, gender: 'male' | 'female') {
  const midiCenter = (lowMidi + highMidi) / 2;

  if (gender === 'male') {
    if (midiCenter < 52.5) {
      return {
        type: 'Bajo (Voz Masculina Grave)',
        description: 'Es el registro masculino más bajo. Posee una gran profundidad, resonancia y cuerpo en los tonos graves.',
        rangeTip: 'Rango típico: Mi2 a Mi4. Cantantes famosos: Johnny Cash, Barry White.'
      };
    } else if (midiCenter < 57.5) {
      return {
        type: 'Barítono (Voz Masculina Media)',
        description: 'El tipo de voz masculina más común. Equilibra tonos graves oscuros y cálidos con agudos brillantes y potentes.',
        rangeTip: 'Rango típico: La2 a Fa4. Cantantes famosos: Frank Sinatra, Freddie Mercury (rango medio).'
      };
    } else {
      return {
        type: 'Tenor (Voz Masculina Aguda)',
        description: 'El registro masculino más alto en voz de pecho. Se destaca por su agilidad, brillo y facilidad en el registro agudo.',
        rangeTip: 'Rango típico: Do3 a La4. Cantantes famosos: Luciano Pavarotti, Bruno Mars.'
      };
    }
  } else {
    if (midiCenter < 64.5) {
      return {
        type: 'Contralto (Voz Femenina Grave)',
        description: 'La voz femenina más grave y poco común. Tiene un sonido muy oscuro, rico, con mucha calidez y cuerpo en el registro bajo.',
        rangeTip: 'Rango típico: Fa3 a Do5. Cantantes famosas: Adele, Amy Winehouse.'
      };
    } else if (midiCenter < 69.5) {
      return {
        type: 'Mezzosoprano (Voz Femenina Media)',
        description: 'La voz femenina intermedia. Combina un registro medio con cuerpo y calidez junto con notas agudas potentes.',
        rangeTip: 'Rango típico: La3 a Fa5. Cantantes famosas: Whitney Houston, Beyoncé.'
      };
    } else {
      return {
        type: 'Soprano (Voz Femenina Aguda)',
        description: 'El registro femenino más alto. Su timbre es brillante, cristalino y ágil, ideal para notas sobreagudas del registro de cabeza.',
        rangeTip: 'Rango típico: Do4 a La5. Cantantes famosas: Celine Dion, Mariah Carey.'
      };
    }
  }
}

const VOICE_PROFILES = [
  { name: 'Bajo', low: 40, high: 64, notes: 'Mi2 - Mi4', type: 'male' },
  { name: 'Barítono', low: 45, high: 65, notes: 'La2 - Fa4', type: 'male' },
  { name: 'Tenor', low: 48, high: 69, notes: 'Do3 - La4', type: 'male' },
  { name: 'Contralto', low: 53, high: 74, notes: 'Fa3 - Do5', type: 'female' },
  { name: 'Mezzosoprano', low: 57, high: 77, notes: 'La3 - Fa5', type: 'female' },
  { name: 'Soprano', low: 60, high: 84, notes: 'Do4 - La5', type: 'female' },
];

const chartMinMidi = 36; // C2
const chartMaxMidi = 88; // E6

export const VocalRangeTest: React.FC = () => {
  const [stage, setStage] = useState<TestStage>('idle');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [lowestMidi, setLowestMidi] = useState<number | null>(null);
  const [highestMidi, setHighestMidi] = useState<number | null>(null);
  const [currentLowest, setCurrentLowest] = useState<number | null>(null);
  const [currentHighest, setCurrentHighest] = useState<number | null>(null);

  const stableNoteRef = useRef<number | null>(null);
  const stableSinceRef = useRef<number>(0);

  const isRecording = stage === 'lowest' || stage === 'highest';
  const pitchData = usePitchDetection(isRecording);

  // Monitor pitch inputs in real-time
  useEffect(() => {
    if (!pitchData) {
      stableNoteRef.current = null;
      return;
    }

    const midi = pitchData.noteNumber;

    // Filter sanity bounds for singing range (MIDI 36 to 96 / C2 to C7)
    if (midi < 36 || midi > 96) {
      stableNoteRef.current = null;
      return;
    }

    const now = Date.now();
    if (stableNoteRef.current !== midi) {
      stableNoteRef.current = midi;
      stableSinceRef.current = now;
      return;
    }

    // Require the note to be sustained stable for at least 1.5 seconds to register as a limit,
    // protecting against short background noises, mouth clicks, or whistles.
    const durationSec = (now - stableSinceRef.current) / 1000;
    if (durationSec >= 1.5) {
      if (stage === 'lowest') {
        if (currentLowest === null || midi < currentLowest) {
          setCurrentLowest(midi);
        }
      } else if (stage === 'highest') {
        // Guard: ignore notes that are lower than or equal to the recorded lowest note to prevent bleed/noises
        if (lowestMidi !== null && midi <= lowestMidi) return;

        if (currentHighest === null || midi > currentHighest) {
          setCurrentHighest(midi);
        }
      }
    }
  }, [pitchData, stage, currentLowest, currentHighest, lowestMidi]);

  const startTest = () => {
    setStage('lowest');
    setLowestMidi(null);
    setHighestMidi(null);
    setCurrentLowest(null);
    setCurrentHighest(null);
  };

  const lockLowestNote = () => {
    if (currentLowest !== null) {
      setLowestMidi(currentLowest);
      setStage('highest');
    }
  };

  const lockHighestNote = () => {
    if (currentHighest !== null) {
      setHighestMidi(currentHighest);
      setStage('result');
    }
  };

  const restartTest = () => {
    setStage('idle');
    setGender(null);
    setLowestMidi(null);
    setHighestMidi(null);
    setCurrentLowest(null);
    setCurrentHighest(null);
  };

  // Calculate stats
  const totalOctaves = lowestMidi && highestMidi 
    ? parseFloat(((highestMidi - lowestMidi) / 12).toFixed(1)) 
    : 0;

  const classification = lowestMidi && highestMidi && gender
    ? classifyVoice(lowestMidi, highestMidi, gender) 
    : null;

  // Piano rendering calculations
  const getPrecedingWhiteKeyCount = (midi: number): number => {
    return midiNotes.filter(n => !n.isBlack && n.midi < midi).length;
  };

  const getBlackKeyLeftPosition = (midi: number): string => {
    const precedingCount = getPrecedingWhiteKeyCount(midi);
    const whiteKeyWidthPercent = 100 / totalWhiteKeys;
    const leftPercent = precedingCount * whiteKeyWidthPercent - (whiteKeyWidthPercent * 0.6) / 2;
    return `${leftPercent}%`;
  };

  const getBarPosition = (low: number, high: number) => {
    const clampedLow = Math.max(chartMinMidi, low);
    const clampedHigh = Math.min(chartMaxMidi, high);
    const left = ((clampedLow - chartMinMidi) / (chartMaxMidi - chartMinMidi)) * 100;
    const width = ((clampedHigh - clampedLow) / (chartMaxMidi - chartMinMidi)) * 100;
    return {
      left: `${left}%`,
      width: `${width}%`
    };
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Title inside card for dashboard alignment */}
        {stage !== 'result' && (
          <div className="mb-8 text-center border-b border-white/10 pb-6 w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Test de Rango Vocal</h2>
            <p className="text-sm text-gray-400 mt-2">Canta tus notas límites cómodas y descubre tu tipo de voz y octavas.</p>
          </div>
        )}
        
        {/* Stage 1: IDLE */}
        {stage === 'idle' && (
          <div className="text-center py-8 max-w-xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[#EC96A4]/10 border border-[#EC96A4]/20 flex items-center justify-center text-[#EC96A4] mb-8 animate-pulse">
              <Music size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¿Cuál es tu Rango Vocal?</h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              En este test guiado vas a cantar tu nota más grave y tu nota más aguda. Con estos datos calcularemos tu extensión vocal exacta y te clasificaremos en una categoría (Soprano, Tenor, Bajo, etc.).
            </p>

            {/* Gender Selection */}
            <div className="flex flex-col items-center w-full mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">
                Elige tu género de referencia para la clasificación:
              </span>
              <div className="flex gap-4 w-full max-w-sm justify-center">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-4 px-6 rounded-2xl border font-bold transition-all text-sm flex flex-col items-center justify-center gap-2 ${
                    gender === 'male'
                      ? 'bg-[#EC96A4]/20 border-[#EC96A4]/40 text-white shadow-lg shadow-[#EC96A4]/10'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">👨</span>
                  <span>Masculino</span>
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-4 px-6 rounded-2xl border font-bold transition-all text-sm flex flex-col items-center justify-center gap-2 ${
                    gender === 'female'
                      ? 'bg-[#EC96A4]/20 border-[#EC96A4]/40 text-white shadow-lg shadow-[#EC96A4]/10'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">👩</span>
                  <span>Femenino</span>
                </button>
              </div>
            </div>

            <button 
              onClick={startTest}
              disabled={!gender}
              className={`px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                !gender 
                  ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed hover:scale-100' 
                  : 'text-primary hover:shadow-[0_0_30px_rgba(236,150,164,0.3)]'
              }`}
              style={{ backgroundColor: !gender ? 'transparent' : theme.colors.secondary }}
            >
              Comenzar Test
            </button>
          </div>
        )}

        {/* Stage 2 & 3: RECORDING LOWEST / HIGHEST */}
        {isRecording && (
          <div className="flex flex-col items-center justify-center py-6 text-center max-w-2xl mx-auto">
            
            {/* Stage indicator tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs tracking-wider mb-6 font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
              {stage === 'lowest' ? 'Paso 1: Tu Nota Más Grave' : 'Paso 2: Tu Nota Más Aguda'}
            </div>

            {/* Instruction */}
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {stage === 'lowest' 
                ? 'Canta tu nota más grave' 
                : 'Canta tu nota más aguda'}
            </h3>
            <p className="text-gray-400 text-xs md:text-sm max-w-md mb-8 leading-relaxed">
              {stage === 'lowest'
                ? 'Canta una nota baja de forma sostenida (puedes usar la vocal "U" o "O"). El medidor registrará automáticamente la nota más grave estable.'
                : 'Canta una nota alta de forma sostenida (puedes usar la vocal "A" o "I"). El medidor registrará automáticamente la nota más aguda estable.'}
            </p>

            {/* Visual Note Scale Slider */}
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 relative">
              <div className="flex justify-between text-[10px] text-gray-400 mb-4 font-bold uppercase tracking-wider">
                <span>Grave (C2)</span>
                <span>Medio (C4)</span>
                <span>Agudo (C6)</span>
              </div>
              
              {/* Slider Track */}
              <div className="w-full h-3 bg-gray-800 rounded-full relative mb-5 shadow-inner">
                {/* Current singing note cursor */}
                {pitchData && (
                  <div 
                    className="absolute w-5 h-5 rounded-full bg-white shadow-[0_0_12px_white] border-2 border-[#EC96A4] z-20 transition-all duration-150 transform -translate-x-1/2 -translate-y-1/3"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((pitchData.noteNumber - 36) / (84 - 36)) * 100))}%`,
                      top: '0%'
                    }}
                  ></div>
                )}

                {/* Best registered note marker (Grave) */}
                {stage === 'lowest' && currentLowest !== null && (
                  <div 
                    className="absolute w-1.5 h-6 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10 transform -translate-x-1/2 -translate-y-1/4"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((currentLowest - 36) / (84 - 36)) * 100))}%`,
                      top: '0%'
                    }}
                  >
                    <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-emerald-400 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Grave: {formatMidiNoteName(currentLowest)}
                    </div>
                  </div>
                )}

                {stage === 'highest' && currentHighest !== null && (
                  <div 
                    className="absolute w-1.5 h-6 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] z-10 transform -translate-x-1/2 -translate-y-1/4"
                    style={{ 
                      left: `${Math.max(0, Math.min(100, ((currentHighest - 36) / (84 - 36)) * 100))}%`,
                      top: '0%'
                    }}
                  >
                    <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-[9px] font-bold text-emerald-400 whitespace-nowrap bg-black/60 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      Aguda: {formatMidiNoteName(currentHighest)}
                    </div>
                  </div>
                )}
              </div>

              {/* Tips for current stage */}
              <p className="text-[11px] text-gray-400 leading-relaxed text-center font-medium">
                {stage === 'lowest' 
                  ? '💡 Sostén la nota más baja de forma estable por 1 o 2 segundos para confirmarla en el medidor.'
                  : '💡 Sostén la nota más alta de forma estable por 1 o 2 segundos para confirmarla en el medidor.'}
              </p>
            </div>

            {/* Simplified Single Note Display */}
            <div className="w-full max-w-xs bg-white/5 border border-white/10 rounded-2xl py-6 px-8 flex flex-col items-center justify-center mb-8 shadow-inner relative overflow-hidden backdrop-blur-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nota Detectada</span>
              <span className="text-5xl md:text-6xl font-black text-white mt-3 drop-shadow">
                {pitchData ? pitchData.note : '-'}
              </span>
              <span className="text-xs text-gray-500 mt-2 font-medium">
                {pitchData ? `${Math.round(pitchData.pitch)} Hz` : 'Esperando canto...'}
              </span>
            </div>

            {/* Save Buttons */}
            {stage === 'lowest' ? (
              <button 
                onClick={lockLowestNote}
                disabled={currentLowest === null}
                className={`px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                  currentLowest === null 
                    ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed' 
                    : 'text-primary'
                }`}
                style={{ backgroundColor: currentLowest === null ? 'transparent' : theme.colors.secondary }}
              >
                Guardar Nota Grave y Continuar
              </button>
            ) : (
              <button 
                onClick={lockHighestNote}
                disabled={currentHighest === null}
                className={`px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                  currentHighest === null 
                    ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed' 
                    : 'text-primary'
                }`}
                style={{ backgroundColor: currentHighest === null ? 'transparent' : theme.colors.secondary }}
              >
                Guardar Nota Aguda y Ver Resultados
              </button>
            )}

          </div>
        )}

        {/* Stage 4: RESULT */}
        {stage === 'result' && classification && lowestMidi && highestMidi && (
          <div className="animate-fade-in py-4 flex flex-col items-center">
            
            {/* Header info */}
            <div className="text-center max-w-xl mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs tracking-wider mb-4 font-bold uppercase">
                <CheckCircle size={14} /> Test Completado
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">Tu voz es de {classification.type}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{classification.description}</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nota Grave</span>
                <span className="text-3xl font-black text-white mt-2">{formatMidiNoteName(lowestMidi)}</span>
                <span className="text-[10px] text-gray-500 mt-1">Límite inferior</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center" style={{ borderColor: 'rgba(236,150,164,0.3)' }}>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Extensión Vocal</span>
                <span className="text-4xl font-black text-white mt-2" style={{ color: theme.colors.secondary }}>{totalOctaves}</span>
                <span className="text-xs text-gray-400 font-semibold mt-1">Octavas Registradas</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nota Aguda</span>
                <span className="text-3xl font-black text-white mt-2">{formatMidiNoteName(highestMidi)}</span>
                <span className="text-[10px] text-gray-500 mt-1">Límite superior</span>
              </div>
            </div>

            {/* Vocal Range Comparison Chart */}
            <div className="w-full max-w-3xl mb-10 bg-white/5 border border-white/10 rounded-3xl p-6 relative">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
                <Activity size={16} style={{ color: theme.colors.secondary }} /> Comparativa de Rangos Vocales
              </h4>

              <div className="relative w-full flex flex-col gap-4">
                
                {/* Vertical grid lines overlay */}
                <div className="absolute left-[140px] right-0 top-0 bottom-0 pointer-events-none flex justify-between text-[9px] text-gray-600">
                  <div className="border-l border-white/5 h-full flex flex-col justify-between">
                    <span className="transform -translate-x-1/2">Do2</span>
                    <span className="transform -translate-x-1/2 mt-auto">C2</span>
                  </div>
                  <div className="border-l border-white/5 h-full flex flex-col justify-between">
                    <span className="transform -translate-x-1/2">Do3</span>
                    <span className="transform -translate-x-1/2 mt-auto">C3</span>
                  </div>
                  <div className="border-l border-white/5 h-full flex flex-col justify-between">
                    <span className="transform -translate-x-1/2">Do4</span>
                    <span className="transform -translate-x-1/2 mt-auto">C4</span>
                  </div>
                  <div className="border-l border-white/5 h-full flex flex-col justify-between">
                    <span className="transform -translate-x-1/2">Do5</span>
                    <span className="transform -translate-x-1/2 mt-auto">C5</span>
                  </div>
                  <div className="border-l border-white/5 h-full flex flex-col justify-between">
                    <span className="transform -translate-x-1/2">Do6</span>
                    <span className="transform -translate-x-1/2 mt-auto">C6</span>
                  </div>
                </div>

                {/* Profiles */}
                <div className="flex flex-col gap-3.5 relative z-10 pt-4 pb-4">
                  {VOICE_PROFILES.map((profile) => {
                    const isUserClassification = classification.type.toLowerCase().includes(profile.name.toLowerCase());
                    const { left, width } = getBarPosition(profile.low, profile.high);
                    return (
                      <div key={profile.name} className="flex items-center">
                        {/* Name & Range label */}
                        <div className="w-[140px] pr-4 flex flex-col justify-center">
                          <span className={`text-[11px] font-bold leading-tight ${isUserClassification ? 'text-[#EC96A4]' : 'text-gray-400'}`}>
                            {profile.name} {isUserClassification && '✓'}
                          </span>
                          <span className="text-[9px] text-gray-500 font-medium">
                            {profile.notes}
                          </span>
                        </div>
                        {/* Bar track */}
                        <div className="flex-1 h-3 bg-white/5 rounded-full relative overflow-hidden">
                          <div
                            className={`absolute h-full rounded-full transition-all duration-500 ${
                              isUserClassification
                                ? 'bg-[#EC96A4]/35 border border-[#EC96A4]/50 shadow-[0_0_8px_rgba(236,150,164,0.2)]'
                                : 'bg-white/10'
                            }`}
                            style={{ left, width }}
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* Divider */}
                  <div className="border-t border-white/10 my-1 ml-[140px]"></div>

                  {/* User Bar */}
                  <div className="flex items-center">
                    <div className="w-[140px] pr-4 flex flex-col justify-center">
                      <span className="text-xs font-black text-white leading-tight uppercase tracking-wider">
                        Tu Rango
                      </span>
                      <span className="text-[10px] text-rose-300 font-bold">
                        {formatMidiNoteName(lowestMidi)} - {formatMidiNoteName(highestMidi)}
                      </span>
                    </div>
                    {/* Bar track */}
                    <div className="flex-1 h-4 bg-white/5 rounded-full relative overflow-hidden border border-white/10">
                      <div
                        className="absolute h-full rounded-full bg-gradient-to-r from-rose-400 via-[#EC96A4] to-rose-300 shadow-[0_0_12px_rgba(236,150,164,0.8)]"
                        style={getBarPosition(lowestMidi, highestMidi)}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Interactive Keyboard Visualizer */}
            <div className="w-full max-w-3xl mb-10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <Keyboard size={16} /> Tu rango visualizado en el teclado
              </h4>
              
              <div className="flex relative bg-neutral-900 p-4 rounded-3xl border border-white/10 overflow-x-auto w-full select-none justify-center">
                {/* Horizontal scroll support container */}
                <div className="flex relative h-40 w-[640px] flex-none">
                  
                  {/* White Keys */}
                  {midiNotes.filter(n => !n.isBlack).map((note) => {
                    const isHighlighted = note.midi >= lowestMidi && note.midi <= highestMidi;
                    const isLowest = note.midi === lowestMidi;
                    const isHighest = note.midi === highestMidi;
                    return (
                      <div 
                        key={note.midi}
                        className={`h-full border-r border-neutral-300 rounded-b-md transition-all duration-500 relative ${
                          isHighlighted 
                            ? 'bg-rose-100 shadow-[inset_0_-14px_0_rgba(236,150,164,0.7)]' 
                            : 'bg-white'
                        }`}
                        style={{ width: `${100 / totalWhiteKeys}%` }}
                      >
                        {/* Highlights on borders */}
                        {isLowest && (
                          <div className="absolute bottom-6 left-0 right-0 text-[9px] font-black text-rose-600 text-center">
                            Min
                          </div>
                        )}
                        {isHighest && (
                          <div className="absolute bottom-6 left-0 right-0 text-[9px] font-black text-rose-600 text-center">
                            Max
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Black Keys overlay */}
                  {midiNotes.filter(n => n.isBlack).map((note) => {
                    const isHighlighted = note.midi >= lowestMidi && note.midi <= highestMidi;
                    const leftPos = getBlackKeyLeftPosition(note.midi);
                    const isLowest = note.midi === lowestMidi;
                    const isHighest = note.midi === highestMidi;
                    const whiteKeyWidthPercent = 100 / totalWhiteKeys;
                    return (
                      <div 
                        key={note.midi}
                        className={`absolute top-0 h-[60%] rounded-b transition-all duration-500 border border-black/30 flex flex-col justify-end pb-2 ${
                          isHighlighted 
                            ? 'bg-rose-400 shadow-[inset_0_-8px_0_rgba(236,150,164,1)]' 
                            : 'bg-neutral-800'
                        }`}
                        style={{ 
                          left: leftPos,
                          width: `${whiteKeyWidthPercent * 0.6}%`,
                          zIndex: 10
                        }}
                      >
                        {isLowest && <span className="text-[7px] text-white font-bold text-center block leading-none">Min</span>}
                        {isHighest && <span className="text-[7px] text-white font-bold text-center block leading-none">Max</span>}
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>

            {/* Details Box */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 w-full max-w-3xl mb-10 flex flex-col gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Info size={14} /> Recomendación de Práctica
              </span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {classification.rangeTip}
              </p>
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Conocer tu rango te ayuda a transponer canciones a tonos que no fuercen tus límites. Recuerda que con entrenamiento técnico y de apoyo puedes extender tu rango (sobre todo los agudos en voz de cabeza) hasta media octava más.
              </p>
            </div>

            {/* Restart Button */}
            <button 
              onClick={restartTest}
              className="flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-full transition-all hover:scale-105"
            >
              <RefreshCw size={16} /> Repetir Test
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
