'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a 
      href="https://wa.me/1234567890" 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all hover:scale-110 animate-bounce-slow flex items-center gap-2 group"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="text-white w-8 h-8" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-white font-bold whitespace-nowrap">
        ¡Hablame!
      </span>
    </a>
  );
};

