'use client';

import React, { useState } from 'react';
import { CheckCircle2, X, ChevronRight } from 'lucide-react';
import { theme } from '@/constants/theme';

interface Plan {
  title: string;
  price: string;
  desc: string;
  fullDesc: string;
  features: string[];
  highlight: boolean;
}

const plans: Plan[] = [
  {
    title: 'Sesiones Individuales',
    price: 'Personalizado 1 a 1',
    desc: 'Un espacio exclusivo para derribar tus bloqueos técnicos y potenciar tu desarrollo vocal único.',
    fullDesc: 'En mis clases 1 a 1, el foco está puesto exclusivamente en vos. Trabajamos de manera minuciosa para entender tus necesidades y potenciar tu sonido.\n\nMi método incluye un entrenamiento profundo: desde la respiración diafragmática y la liberación de tensiones en mandíbula y rostro, hasta el posicionamiento preciso de la lengua para una proyección libre y potente. Usamos el piano para vocalizar y ganar conciencia real sobre la impostación de cada nota en tu registro.\n\nEste espacio es ideal para vos si sos cantante (profesional o no), actor, presentador de TV/Radio o ejecutivo que busca dominar su herramienta comunicativa.',
    features: ['Diagnóstico Vocal', 'Ejercicios a medida', 'Vocalización con piano'],
    highlight: false
  },
  {
    title: 'Clases Grupales',
    price: 'Grupos Reducidos',
    desc: 'Aprendizaje dinámico y motivador, ideal para compartir el proceso y aprender junto a otros.',
    fullDesc: 'Si buscás un espacio dinámico, mis clases grupales son la opción ideal. Trabajamos la técnica de forma sincronizada, compartiendo el proceso con otros compañeros. Mientras unos descansan y observan, otros exploran, lo que permite un aprendizaje mutuo constante.\n\nEs la modalidad perfecta para parejas, amigos o bandas que quieren mejorar su compenetración musical. Trabajamos técnica vocal, respiración, ejercicios de mandíbula y vocalizaciones, llevándolo todo a canciones y dinámicas de improvisación.\n\nEs la alternativa más económica, brindándote un apoyo humano y físico fundamental para que te animes a soltar tu voz junto a otros.',
    features: ['Técnica sincronizada', 'Dinámicas de grupo', 'Opción económica'],
    highlight: true
  },
  {
    title: 'Acompañamiento Artístico',
    price: 'Preparación para Estudio',
    desc: 'Preparación integral para grabaciones de estudio, selección de repertorio y coaching interpretativo.',
    fullDesc: 'Grabar tu música es un momento sagrado, y quiero acompañarte para que des tu mejor versión. En este entrenamiento específico, te ayudo a preparar cada track de punta a punta: desde la selección estratégica del repertorio hasta el pulido final de la interpretación.\n\nTrabajamos técnica de micrófono, dinámicas de estudio y, sobre todo, la intención emocional para que cada toma transmita exactamente lo que buscás. Te preparo física y mentalmente para que llegues al estudio con seguridad, optimices los tiempos de grabación y logres un resultado profesional que te represente al 100%.',
    features: ['Selección de grabaciones', 'Técnica de micrófono', 'Coaching emocional'],
    highlight: false
  }
];

export const Clases: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedPlan(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="clases" className="py-20 px-6 relative" style={{ backgroundColor: theme.colors.tertiary }}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Modalidades de Trabajo</h2>
        <p className="text-lg text-gray-400 mb-12">
          🎶 Todos los niveles – no necesitás experiencia previa.<br/>
          Tu voz tiene una historia que contar. Agendá tu primera sesión y empezá a descubrirla.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative p-8 rounded-2xl transition-transform hover:-translate-y-2 flex flex-col ${
                plan.highlight 
                  ? 'bg-white text-gray-900 shadow-xl scale-105 z-10' 
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
              <p className={`mb-8 flex-grow ${plan.highlight ? 'text-gray-600' : 'text-gray-400'}`}>{plan.desc}</p>
              
              <div className="mb-10 flex justify-center">
                <button 
                  onClick={() => openModal(plan)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border flex items-center gap-1 group/btn ${
                    plan.highlight 
                      ? 'border-gray-200 text-gray-800 hover:bg-gray-100' 
                      : 'border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  Más información
                  <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

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
                onClick={() => window.open(process.env.NEXT_PUBLIC_WHATSAPP_URL || '#', '_blank')}
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

      {/* Modal Overlay */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          onClick={closeModal}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <div 
            className="bg-gray-900 border border-white/10 w-full max-w-2xl rounded-3xl p-8 relative z-10 max-h-[90vh] overflow-y-auto animate-fade-in-up shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#EC96A4]">{selectedPlan.price}</span>
              <h3 className="text-3xl font-bold mt-2 text-white">{selectedPlan.title}</h3>
            </div>
            
            <div className="text-gray-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-white/5 pt-6">
              {selectedPlan.fullDesc}
            </div>
            
            <button 
              onClick={() => {
                closeModal();
                window.open(process.env.NEXT_PUBLIC_WHATSAPP_URL || '#', '_blank');
              }}
              className="mt-10 w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.02] shadow-xl"
              style={{ backgroundColor: theme.colors.secondary }}
            >
              Consultar por esta modalidad
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

