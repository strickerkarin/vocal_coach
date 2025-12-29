'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Metodo } from '@/components/Metodo';
import { SobreMi } from '@/components/SobreMi';
import { Clases } from '@/components/Clases';
import { Testimonios } from '@/components/Testimonios';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { theme } from '@/constants/theme';

export default function Home() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="min-h-screen font-sans selection:bg-[#EC96A4] selection:text-white" 
      style={{ backgroundColor: theme.colors.primary, color: theme.colors.accent }}
    >
      <Navbar onNavigate={scrollToSection} />
      <Hero onNavigate={scrollToSection} />
      <Metodo />
      <SobreMi />
      <Clases />
      <Testimonios />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
