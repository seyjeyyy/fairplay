import { useState } from 'react';
import { motion } from 'framer-motion';
import useRegistrationStore from '../../store/registrationStore';

export default function QRVerification({ onVerified }) {
  const { verifyQR } = useRegistrationStore();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [qrInput, setQrInput] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!qrInput.trim()) {
      setError('Please scan or paste a QR code');
      return;
    }
    setScanning(true);
    setError('');

    // Simulate QR scan delay
    setTimeout(() => {
      const verification = verifyQR(qrInput);
      if (verification.valid) {
        setResult(verification.data);
        if (onVerified) onVerified(verification.data);
      } else {
        setError('Invalid QR code. Please try again.');
        setResult(null);
      }
      setScanning(false);
    }, 500);
  };

  return (
    <div style={{
      background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)',
      borderRadius: 16, padding: 28, maxWidth: 500,
    }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 48, marginBottom: 12, display: 'block' }}>📱</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>QR Code Verification</h3>
        <p style={{ color: '#a0aec0', fontSize: 13 }}>Scan participant QR code to verify identity</p>
      </div>

      {/* QR Input Area */}
      <div style={{
        width: 200, height: 200, margin: '0 auto 20px',
        background: 'rgba(0,0,0,0.4)', borderRadius: 16,
        border: '2px dashed rgba(6,182,212,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
        onClick={() => document.getElementById('qr-input').focus()}
      >
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: 40, opacity: 0.5 }}>📷</span>
          <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>Tap to scan QR</p>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>
          Or paste QR data:
        </label>
        <textarea
          id="qr-input"
          value={qrInput}
          onChange={(e) => { setQrInput(e.target.value); setError(''); setResult(null); }}
          placeholder="Paste QR code data here..."
          rows={2}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            color: '#fff', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'monospace',
          }}
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={scanning}
        style={{
          width: '100%', padding: '12px', borderRadius: 10,
          background: scanning ? '#333' : 'linear-gradient(135deg, #06b6d4, #0084ff)',
          color: scanning ? '#666' : '#000', border: 'none',
          fontWeight: 700, fontSize: 14, cursor: scanning ? 'not-allowed' : 'pointer',
        }}
      >
        {scanning ? '🔍 Verifying...' : '🔍 Verify Identity'}
      </button>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: 13, textAlign: 'center' }}
        >
          ⚠ {error}
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: 16, padding: 20, borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 40 }}>✅</span>
            <h4 style={{ fontSize: 16, fontWeight: 700, color: '#10b981', marginTop: 8 }}>Identity Verified!</h4>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#a0aec0' }}>Name</span>
              <span style={{ fontWeight: 700 }}>{result.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#a0aec0' }}>Type</span>
              <span style={{ fontWeight: 700 }}>{result.type}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
              <span style={{ color: '#a0aec0' }}>Event</span>
              <span style={{ fontWeight: 700 }}>{result.eventTitle}</span>
            </div>
            {result.teamName && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                <span style={{ color: '#a0aec0' }}>Team</span>
                <span style={{ fontWeight: 700 }}>{result.teamName}</span>
              </div>
            )}
            {result.jerseyNumber && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                <span style={{ color: '#a0aec0' }}>Jersey #</span>
                <span style={{ fontWeight: 700 }}>{result.jerseyNumber}</span>
              </div>
            )}
            {result.role && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                <span style={{ color: '#a0aec0' }}>Role</span>
                <span style={{ fontWeight: 700 }}>{result.role}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}