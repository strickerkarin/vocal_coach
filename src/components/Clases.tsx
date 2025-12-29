'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { theme } from '@/constants/theme';

interface Plan {
  title: string;
  price: string;
  desc: string;
  features: string[];
  highlight: boolean;
}

const plans: Plan[] = [
  {
    title: 'Clases Individuales',
    price: 'Personalizado',
    desc: '1 a 1. Atención total a tus objetivos. Ideal para quienes buscan un progreso acelerado y correcciones minuciosas.',
    features: ['Diagnóstico Vocal', 'Ejercicios a medida', 'Grabación de clase'],
    highlight: false
  },
  {
    title: 'Pack Mensual',
    price: 'Más Popular',
    desc: 'Un proceso continuo. 4 clases al mes para generar hábitos saludables y construir repertorio sólido.',
    features: ['Seguimiento por WhatsApp', 'Material de estudio', 'Descuento especial'],
    highlight: true
  },
  {
    title: 'Coaching para Audiciones',
    price: 'Intensivo',
    desc: 'Preparación específica para castings, ingresos a conservatorios o grabaciones de estudio.',
    features: ['Simulacro de audición', 'Selección de repertorio', 'Manejo escénico'],
    highlight: false
  }
];

export const Clases: React.FC = () => {
  return (
    <section id="clases" className="py-20 px-6" style={{ backgroundColor: theme.colors.tertiary }}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">Modalidades de Trabajo</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-2xl transition-transform hover:-translate-y-2 ${
                plan.highlight 
                  ? 'bg-white text-gray-900 shadow-xl scale-105' 
                  : 'bg-primary border border-white/10 text-white'
              }`}
              style={plan.highlight ? {} : { backgroundColor: theme.colors.primary }}
            >
              {plan.highlight && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg" 
                  style={{ backgroundColor: theme.colors.secondary }}
                >
                  Recomendado
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
              <div className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6">{plan.price}</div>
              <p className={`mb-8 ${plan.highlight ? 'text-gray-600' : 'text-gray-400'}`}>{plan.desc}</p>
              <ul className="space-y-3 mb-8 text-left">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 
                      size={16} 
                      style={{ color: plan.highlight ? theme.colors.secondary : theme.colors.success }} 
                    />
                    {feat}
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => window.open('https://wa.me/1234567890?text=Hola,%20quiero%20info%20sobre%20las%20clases...', '_blank')}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  plan.highlight 
                    ? 'text-white hover:bg-gray-700' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
                style={plan.highlight ? { backgroundColor: theme.colors.tertiary } : {}}
              >
                Consultar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

