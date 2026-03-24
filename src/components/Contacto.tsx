import React from 'react';
import { MapPin, Navigation, Info } from 'lucide-react';
import { theme as siteTheme } from '@/constants/theme';

export const Contacto: React.FC = () => {
  // Placeholder address URL - to be replaced with actual details from the user
  const googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168!2d-58.4!3d-34.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzTCsDM2JzAwLjAiUyA1OMKwMjQnMDAuMCJX!5e0!3m2!1sen!2sar!4v1620000000000!5m2!1sen!2sar";

  return (
    <section id="contacto" className="py-20 px-6 bg-black/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-stretch">
          
          {/* Instructions Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase mb-2 text-[#EC96A4]">Ubicación</h2>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">Cómo llegar</h3>
            </div>
            
            <div className="space-y-4 flex-grow">
              <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 h-[110px]">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#EC96A4]/10 flex items-center justify-center">
                  <MapPin size={20} style={{ color: siteTheme.colors.secondary }} />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Dirección</h4>
                  <p className="text-gray-400 text-sm italic">Esperando detalles de la dirección...</p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 h-[110px]">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#EC96A4]/10 flex items-center justify-center">
                  <Navigation size={20} style={{ color: siteTheme.colors.secondary }} />
                </div>
                <div>
                  <h4 className="font-bold text-base mb-1">Instrucciones</h4>
                  <p className="text-gray-400 text-sm leading-tight italic">
                    Esperando detalles sobre colectivos, trenes o puntos de referencia.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-[#EC96A4]/20 shadow-[0_0_20px_rgba(236,150,164,0.05)] h-[130px]">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#EC96A4]/20 flex items-center justify-center">
                  <Info size={20} style={{ color: siteTheme.colors.secondary }} />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-base mb-1">Nota importante</h4>
                    <p className="text-gray-400 text-xs">Atención con turno previo. ¡También clases online!</p>
                  </div>
                  <button 
                    onClick={() => window.open(process.env.NEXT_PUBLIC_WHATSAPP_URL, '_blank')}
                    className="mt-3 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all border border-[#EC96A4]/30 text-[#EC96A4] hover:bg-[#EC96A4] hover:text-white flex items-center gap-2 self-start"
                  >
                    Consultar por WhatsApp
                    <Navigation size={10} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="w-full md:w-1/2 h-[450px] md:h-auto min-h-[400px] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl relative">
            <iframe 
              src={googleMapsUrl}
              width="100%" 
              height="100%" 
              style={{ 
                border: 0, 
                filter: 'grayscale(0.1) sepia(0.4) saturate(1) hue-rotate(300deg) brightness(0.7) contrast(1.2)' 
              }} 
              allowFullScreen={true} 
              loading="lazy"
              title="Ubicación de Carla Abalos"
            ></iframe>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-white/10">
              📍 Zona Norte / Palermo (TBD)
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
