'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { theme } from '@/constants/theme';

interface Testimonio {
  name: string;
  text: string;
  role: string;
}

const testimonios: Testimonio[] = [
  { 
    name: "Sofía M.", 
    text: "Llegué con nódulos y miedo a cantar. Hoy tengo una técnica sólida y recuperé mi confianza. Es mágica.", 
    role: "Cantante Amateur" 
  },
  { 
    name: "Lucas R.", 
    text: "Las clases son súper dinámicas. Me encanta que no solo vemos técnica, sino cómo interpretar la letra. Recomendadísima.", 
    role: "Músico" 
  },
  { 
    name: "Valeria T.", 
    text: "Probé con muchos profesores y nadie me explicó el apoyo diafragmático tan claro. Un antes y un después.", 
    role: "Estudiante" 
  },
  { 
    name: "Martín G.", 
    text: "El coaching para mi grabación de estudio fue clave. Logramos tomas increíbles gracias a sus tips de último momento.", 
    role: "Cantante de Banda" 
  }
];

export const Testimonios: React.FC = () => {
  return (
    <section id="testimonios" className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-4 fill-current" />
        <h2 className="text-3xl font-bold">Lo que dicen mis alumnos</h2>
      </div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
        {testimonios.map((t, i) => (
          <div 
            key={i} 
            className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
          >
            <p className="italic text-gray-300 mb-4">&quot;{t.text}&quot;</p>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" 
                style={{ background: `linear-gradient(to bottom right, ${theme.colors.secondary}, purple)` }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-bold text-sm">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

