export interface NoteEvent {
  midiNote: number;
  frequency: number;
  startTime: number;
  duration: number;
  isRest: boolean;
}

export const WARMUP_PATTERNS = {
  'escala_3': {
    name: 'Escala Mayor (3 Tonos)',
    pattern: [0, 2, 4, 2, 0], // Do Re Mi Re Do
  },
  'arpegio_3': {
    name: 'Arpegio Mayor (3 Tonos)',
    pattern: [0, 4, 7, 4, 0], // Do Mi Sol Mi Do
  },
  'escala_5': {
    name: 'Escala Mayor (5 Tonos)',
    pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0], // Do Re Mi Fa Sol Fa Mi Re Do
  },
  'escala_desc_5': {
    name: 'Escala Descendiente Mayor (5 Tonos)',
    pattern: [7, 5, 4, 2, 0], // Sol Fa Mi Re Do
  },
  'escala_7': {
    name: 'Escala Mayor (7 Notas)',
    pattern: [0, 2, 4, 5, 7, 9, 11, 12, 11, 9, 7, 5, 4, 2, 0], // Octava completa subiendo y bajando
  },
  'escala_desc_7': {
    name: 'Escala Descendiente Mayor (7 Notas)',
    pattern: [12, 11, 9, 7, 5, 4, 2, 0], // Octava completa bajando
  }
};

export type WarmupPatternId = keyof typeof WARMUP_PATTERNS;

export function generateWarmupSequence(
  patternId: WarmupPatternId,
  startMidi: number, // e.g. 60 (C4)
  endMidi: number,   // e.g. 72 (C5)
  bpm: number,
  beatsPerNote: number = 1,
  pauseBeatsBetweenModulations: number = 2
): NoteEvent[] {
  const pattern = WARMUP_PATTERNS[patternId].pattern;
  const events: NoteEvent[] = [];
  
  const secondsPerBeat = 60 / bpm;
  const noteDurationSeconds = beatsPerNote * secondsPerBeat;
  const pauseDurationSeconds = pauseBeatsBetweenModulations * secondsPerBeat;
  
  // Start with a 4-beat count-in/preparation time
  let currentStartTime = 4 * secondsPerBeat;
  
  const direction = endMidi >= startMidi ? 1 : -1;
  
  // Calculate absolute highest and lowest intervals in the pattern
  const maxPatternInterval = Math.max(...pattern);
  const minPatternInterval = Math.min(...pattern);
  
  let mod = 0;
  while (true) {
    const currentBaseMidi = startMidi + (mod * direction);
    
    // Safety check: Ensure no note in this modulation exceeds the absolute boundaries
    if (direction === 1) {
      if (currentBaseMidi + maxPatternInterval > endMidi) break;
    } else {
      if (currentBaseMidi + minPatternInterval < endMidi) break;
    }
    
    // Add pattern notes
    for (let i = 0; i < pattern.length; i++) {
      const midiNote = currentBaseMidi + pattern[i];
      const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
      
      events.push({
        midiNote,
        frequency,
        startTime: currentStartTime,
        duration: noteDurationSeconds,
        isRest: false
      });
      
      currentStartTime += noteDurationSeconds;
    }
    
    // Add pause after pattern
    events.push({
      midiNote: 0,
      frequency: 0,
      startTime: currentStartTime,
      duration: pauseDurationSeconds,
      isRest: true
    });
    currentStartTime += pauseDurationSeconds;
    
    mod++;
    
    // Límite de seguridad para evitar loops infinitos (50 repeticiones son casi 4 octavas)
    if (mod > 50) break;
  }
  
  return events;
}

const noteToMidiMap: Record<string, number> = {
  'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
};

export function getMidiFromNote(note: string, octave: number): number {
  const base = noteToMidiMap[note];
  if (base === undefined) return 60; // Default C4
  return base + (octave + 1) * 12;
}

export function getNoteFromMidi(midi: number): string {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return `${notes[noteIndex]}${octave}`;
}
