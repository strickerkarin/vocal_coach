'use client';

import React, { useState, useEffect } from 'react';
import { Mic, Activity, CheckCircle, Music, Play } from 'lucide-react';
import { theme } from '@/constants/theme';
import { usePitchDetection } from '@/hooks/usePitchDetection';

export const Tuner: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const pitchData = usePitchDetection(isRecording);
  
  const [pitch, setPitch] = useState(0); // -50 to 50 cents
  const [note, setNote] = useState('-');
  const [feedback, setFeedback] = useState('Canta una nota...');
  const [feedbackColor, setFeedbackColor] = useState(theme.colors.accent);

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

      if (Math.abs(pitchData.cents) < 10) {
        setFeedback('¡Perfecto! Estás afinado');
        setFeedbackColor(theme.colors.success);
      } else if (pitchData.cents > 0) {
        setFeedback('Un poco alto, baja un poco');
        setFeedbackColor('#FFD166');
      } else {
        setFeedback('Un poco bajo, sube más');
        setFeedbackColor('#EF476F');
      }
    }
  }, [pitchData, isRecording]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

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

        <div className="max-w-[500px] mx-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Visualizer Header */}
            <div className="flex flex-col items-center justify-center mb-8">
              <p className="text-gray-400 font-medium mb-1 uppercase tracking-widest text-sm">Nota Objetivo</p>
              <h3 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">{note}</h3>
              <p className="mt-4 text-xl font-medium transition-colors duration-300" style={{ color: feedbackColor }}>
                {feedback}
              </p>
            </div>

            {/* Gauge / Meter Concept */}
            <div className="relative w-full h-24 flex flex-col items-center justify-center mb-8">
              <div className="w-full h-4 bg-gray-800 rounded-full relative overflow-hidden flex shadow-inner">
                {/* Gradient meter background */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#EF476F] via-[#94D2BD] to-[#FFD166] opacity-80"></div>
                
                {/* Center marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10 transform -translate-x-1/2"></div>
              </div>

              {/* Ticks and labels */}
              <div className="w-full flex justify-between text-xs text-gray-400 mt-4 font-medium uppercase tracking-wide">
                <span>Bajo (Flat)</span>
                <span>Perfecto</span>
                <span>Alto (Sharp)</span>
              </div>

              {/* Moving Needle Indicator */}
              <div 
                className="absolute top-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] border-4 z-20 transition-all duration-700 ease-in-out transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: `${50 + pitch}%`, 
                  borderColor: theme.colors.secondary 
                }}
              ></div>
            </div>

            {/* Simulated Audio Waves */}
            <div className="flex items-end justify-center h-16 gap-1.5 mb-8 opacity-70">
              {[...Array(30)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 rounded-t-full transition-all duration-150 ${isRecording ? 'animate-music-bar' : 'h-1'}`}
                  style={{ 
                    backgroundColor: i % 2 === 0 ? theme.colors.secondary : theme.colors.success,
                    animationDelay: `${Math.random() * 0.5}s`,
                    height: isRecording ? `${Math.max(10, Math.random() * 100)}%` : '4px'
                  }}
                ></div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center">
              <button 
                onClick={toggleRecording}
                className={`flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl ${
                  isRecording ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_30px_rgba(239,71,111,0.4)]' : 'text-primary'
                }`}
                style={{ 
                  backgroundColor: isRecording ? '#EF476F' : theme.colors.secondary,
                }}
              >
                {isRecording ? (
                  <>
                    <Activity size={24} className="animate-pulse" />
                    Detener Prueba
                  </>
                ) : (
                  <>
                    <Mic size={24} />
                    Probar Micrófono
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
