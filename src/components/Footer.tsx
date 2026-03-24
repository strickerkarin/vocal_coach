'use client';

import React from 'react';
import { Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Tu Coach Vocal</h2>
          <p className="text-gray-400 text-sm">Desbloqueando voces, creando artistas.</p>
        </div>
        
        <div className="flex gap-6">
          <a 
            href="https://www.instagram.com/carla.abalos.coachvocal/" 
            target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="https://www.youtube.com/watch?v=vsxQLrNfiQ0" 
            target="_blank" rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </a>
        </div>
      </div>
      <div className="text-center mt-12 text-xs text-gray-600 flex flex-col items-center gap-2">
        <p>© {new Date().getFullYear()} Tu Coach Vocal. Todos los derechos reservados.</p>
        <p className="opacity-50">Hecho por NKLabs</p>
      </div>
    </footer>
  );
};

