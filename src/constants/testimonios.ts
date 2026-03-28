import React from 'react';

export interface Testimonio {
  name: string;
  text: string;
  role: string;
  image?: string;
  imageStyle?: React.CSSProperties;
}

export const testimonios: Testimonio[] = [
  {
    name: "Mora",
    text: "Las clases grupales son muy completas y dinámicas: hacemos respiración, técnica y practicamos canciones. ¡Siempre hay algo nuevo para aprender!",
    role: "Alumna",
    image: "/images/testimonios/mora.jpeg",
    imageStyle: { objectPosition: "center 15%" }
  },
  {
    name: "Bárbara",
    text: "Lo que más me gusta es que son clases 100% personalizadas. Desde el primer momento Carla escuchó mis expectativas y objetivos para trabajar en eso.",
    role: "Alumna",
    image: "/images/testimonios/barbara.jpeg"
  },
  {
    name: "Virginia",
    text: "Es un espacio donde me siento segura, donde puedo explorar mi voz con una profe que me guía con calidez y paciencia.",
    role: "Alumna",
    image: "/images/testimonios/virginia.jpeg"
  },
  {
    name: "Ailen",
    text: "Encuentro la confianza para expresarme, crecer y conectar con la música. Las clases son un espacio donde mi voz refleja mi verdadera esencia.",
    role: "Alumna",
    image: "/images/testimonios/ailen.jpeg"
  },
  {
    name: "Luly",
    text: "Las clases me ayudaron a superar mis miedos; encontré un espacio donde recibo ayuda tanto en lo técnico como en mi confianza.",
    role: "Alumna",
    image: "/images/testimonios/luly.jpeg"
  },
  {
    name: "Melanie",
    text: "Avancé y aprendí muchísimo en técnica, confianza y teoría desde que empecé a tomar clases. ¡Altamente recomendada!",
    role: "Alumna",
    image: "/images/testimonios/melanie.jpeg"
  },
  {
    name: "Karin",
    text: "Amo que se adapten a mis objetivos y me ayuden a superar obstáculos. ¡Disfruto mucho que aplicamos la teoría practicando con canciones que me encantan!",
    role: "Alumna",
    image: "/images/testimonios/karin.png"
  },
  {
    name: "Nahuel",
    text: "Carla es muy dinámica y se preocupa porque entendamos todos los conceptos. Luego los ponemos en práctica con ejercicios personalizados. ¡La súper recomiendo!",
    role: "Alumno",
    image: "/images/testimonios/nahuel.jpeg",
    imageStyle: { transform: "scale(1.8)" }
  }
];
