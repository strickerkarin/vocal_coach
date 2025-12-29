# Vocal Coach - Sitio Web

Sitio web profesional para un vocal coach, construido con Next.js 15 y Tailwind CSS.

## 🚀 Tecnologías

- **Next.js 15.5.9** - Framework React con App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS 3.4.17** - Framework de estilos
- **Lucide React** - Iconos modernos

## 📁 Estructura del Proyecto

```
vocal_coach/
├── src/
│   ├── app/
│   │   ├── globals.css      # Estilos globales y animaciones
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página principal
│   ├── components/           # Componentes modulares
│   │   ├── Navbar.tsx        # Barra de navegación
│   │   ├── Hero.tsx          # Sección hero
│   │   ├── Metodo.tsx        # Sección de metodología
│   │   ├── SobreMi.tsx       # Sección sobre mí
│   │   ├── Clases.tsx        # Sección de clases/servicios
│   │   ├── Testimonios.tsx   # Testimonios de alumnos
│   │   ├── Footer.tsx        # Pie de página
│   │   └── FloatingWhatsApp.tsx # Botón flotante de WhatsApp
│   └── constants/
│       └── theme.ts          # Paleta de colores
├── public/                   # Archivos estáticos
├── tailwind.config.ts        # Configuración de Tailwind
├── tsconfig.json             # Configuración de TypeScript
└── package.json              # Dependencias del proyecto
```

## 🎨 Paleta de Colores

- **Primary**: `#1A1A2E` - Fondo oscuro principal
- **Secondary**: `#EC96A4` - Color berry (acento principal)
- **Tertiary**: `#2D2D44` - Tono suave para tarjetas
- **Accent**: `#FFF1E6` - Crema suave para textos
- **Success**: `#94D2BD` - Verde agua suave

## 🛠️ Instalación y Uso

### Instalar dependencias:
```bash
npm install
```

### Ejecutar en modo desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para producción:
```bash
npm run build
```

### Ejecutar versión de producción:
```bash
npm start
```

### Ejecutar linter:
```bash
npm run lint
```

## ✨ Características

- ✅ **Diseño Responsive** - Adaptado a todos los dispositivos
- ✅ **Navegación Suave** - Scroll animado entre secciones
- ✅ **Componentes Modulares** - Código organizado y reutilizable
- ✅ **TypeScript** - Código tipado para mayor seguridad
- ✅ **Animaciones CSS** - Transiciones y efectos visuales
- ✅ **WhatsApp Integration** - Botón flotante para contacto directo
- ✅ **SEO Optimizado** - Estructura semántica y meta tags
- ✅ **Performance** - Optimizado con Next.js 15

## 📱 Secciones

1. **Hero** - Presentación principal con CTA
2. **Método** - Enfoque y metodología de trabajo (Bento Grid)
3. **Sobre Mí** - Información del vocal coach
4. **Clases** - Modalidades de trabajo y precios
5. **Testimonios** - Opiniones de alumnos
6. **Footer** - Información de contacto y redes sociales

## 🔧 Personalización

### Cambiar el número de WhatsApp:
Busca y reemplaza `1234567890` en todos los componentes con tu número real (formato internacional sin +).

### Modificar colores:
Edita el archivo `src/constants/theme.ts` con tu paleta de colores.

### Cambiar imágenes:
Las URLs de las imágenes están en `src/components/Hero.tsx` y `src/components/SobreMi.tsx`.

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "15.5.9",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.49",
    "eslint": "^9.17.0",
    "eslint-config-next": "15.5.9"
  }
}
```

## 🌐 Despliegue

El proyecto está listo para ser desplegado en:
- **Vercel** (recomendado)
- **Netlify**
- **AWS Amplify**
- Cualquier plataforma que soporte Next.js

### Desplegar en Vercel:
```bash
npm i -g vercel
vercel
```

## 📝 Notas

- Todos los componentes son **client components** ('use client') para permitir interactividad
- Las animaciones CSS están definidas en `src/app/globals.css`
- El proyecto usa **App Router** de Next.js 15
- Sin cambios en funcionalidad ni estilos respecto al código original

## 🤝 Soporte

Para cualquier duda o sugerencia, contacta a través de WhatsApp o redes sociales.

---

**Creado con ❤️ usando Next.js y Tailwind CSS**
