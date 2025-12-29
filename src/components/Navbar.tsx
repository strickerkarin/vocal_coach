'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MessageCircle } from 'lucide-react';
import { theme } from '@/constants/theme';

interface NavbarProps {
  onNavigate: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Método', id: 'metodo' },
    { label: 'Sobre Mí', id: 'sobre-mi' },
    { label: 'Clases', id: 'clases' },
    { label: 'Testimonios', id: 'testimonios' }
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-opacity-95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
      }`} 
      style={{ backgroundColor: scrolled ? theme.colors.primary : 'transparent' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleNavigate('hero')}
        >
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center" 
            style={{ backgroundColor: theme.colors.secondary }}
          >
            <Mic className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter">
            VOCAL<span style={{ color: theme.colors.secondary }}>.COACH</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center font-medium">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleNavigate(item.id)}
              className="hover:text-[#EC96A4] transition-colors uppercase text-sm tracking-widest"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            className="px-6 py-2 rounded-full font-bold transition-transform hover:scale-105 shadow-lg flex items-center gap-2"
            style={{ backgroundColor: theme.colors.secondary, color: 'white' }}
          >
            <MessageCircle size={18} />
            Reservar
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className="space-y-2 cursor-pointer">
            <span className={`block w-8 h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 p-6 flex flex-col gap-4 shadow-2xl border-t border-gray-800">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              onClick={() => handleNavigate(item.id)}
              className="text-left text-lg font-medium py-2 border-b border-gray-800"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => window.open('https://wa.me/1234567890', '_blank')}
            className="mt-4 w-full py-3 rounded-lg font-bold flex justify-center items-center gap-2"
            style={{ backgroundColor: theme.colors.secondary, color: 'white' }}
          >
            Escribime al WhatsApp
          </button>
        </div>
      )}
    </nav>
  );
};

