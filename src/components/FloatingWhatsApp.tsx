'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  return (
    <a 
      href={process.env.NEXT_PUBLIC_WHATSAPP_URL || "#"} 
      target="_blank" 
      rel="noreferrer"
      className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-2xl z-50 transition-all hover:scale-110 animate-bounce-slow flex flex-row items-center justify-center group"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="text-white w-8 h-8" />
      <span className="absolute right-full mr-4 bg-white text-gray-900 px-4 py-2 rounded-xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
        ¡Hablame!
      </span>
    </a>
  );
};

