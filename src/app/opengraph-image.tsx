import { ImageResponse } from 'next/og';
 
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1A1A2E',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EC96A4',
        }}
      >
        <svg
          width="250"
          height="250"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginBottom: 40 }}
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
        <div style={{ fontSize: 72, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 }}>
          Tu Coach Vocal
        </div>
        <div style={{ fontSize: 36, color: '#A0A0B0' }}>
          Clases de canto y entrenamiento vocal con Carla Abalos
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
