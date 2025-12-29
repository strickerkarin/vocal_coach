'use client';

import React from 'react';
import { Instagram, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/10 bg-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Tu Vocal Coach</h2>
          <p className="text-gray-400 text-sm">Desbloqueando voces, creando artistas.</p>
        </div>
        
        <div className="flex gap-6">
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a 
            href="#" 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-colors"
          >
            <Mail size={20} />
          </a>
        </div>
      </div>
      <div className="text-center mt-12 text-xs text-gray-600">
        © {new Date().getFullYear()} Tu Vocal Coach. Todos los derechos reservados.
      </div>
    </footer>
  );
};

