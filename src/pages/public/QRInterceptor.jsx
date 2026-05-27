import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function QRInterceptor() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/scan/${token}`, { replace: true });
  }, [token, navigate]);

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'linear-gradient(135deg, #06b6d4, #0084ff)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 800, color: '#000',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        F
      </div>
      <p style={{ color: '#a0aec0', fontSize: 14 }}>Resolving QR Code...</p>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.95); } }
      `}</style>
    </div>
  );
}
