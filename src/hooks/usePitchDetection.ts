import { useState, useEffect, useRef } from 'react';
import { PitchDetector } from 'pitchy';

interface PitchData {
  pitch: number;
  clarity: number;
  note: string;
  cents: number;
}

const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function getNoteFromFrequency(frequency: number): number {
  const noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
  return Math.round(noteNum) + 69;
}

function getFrequencyFromNote(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

function getCentsOffPitch(frequency: number, note: number): number {
  return Math.floor(1200 * Math.log(frequency / getFrequencyFromNote(note)) / Math.log(2));
}

function formatNoteName(noteNumber: number): string {
  const note = noteStrings[noteNumber % 12];
  const octave = Math.floor(noteNumber / 12) - 1;
  return `${note}${octave}`;
}

export const usePitchDetection = (isRecording: boolean) => {
  const [pitchData, setPitchData] = useState<PitchData | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let detector: PitchDetector<Float32Array>;
    let inputBuffer: Float32Array;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        sourceRef.current = source;

        detector = PitchDetector.forFloat32Array(analyser.fftSize);
        inputBuffer = new Float32Array(detector.inputLength);

        const updatePitch = () => {
          if (!analyserRef.current) return;
          
          analyserRef.current.getFloatTimeDomainData(inputBuffer as any);
          const [pitchValue, clarity] = detector.findPitch(inputBuffer, audioCtx.sampleRate);

          if (clarity > 0.8 && pitchValue > 50 && pitchValue < 2000) {
            const noteNumber = getNoteFromFrequency(pitchValue);
            const noteName = formatNoteName(noteNumber);
            const cents = getCentsOffPitch(pitchValue, noteNumber);

            setPitchData({
              pitch: pitchValue,
              clarity,
              note: noteName,
              cents
            });
          }

          animationFrameRef.current = requestAnimationFrame(updatePitch);
        };

        updatePitch();
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    const stopRecording = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      setPitchData(null);
    };

    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isRecording]);

  return pitchData;
};
