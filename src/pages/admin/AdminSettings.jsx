import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminSettings() {
  const [form, setForm] = useState({
    platformName: 'FairPlay', siteUrl: 'https://fairplay.app',
    supportEmail: 'support@fairplay.app', maxEvents: 'Unlimited',
    maintenance: false, registration: true, aiEnabled: true,
  });

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    background: '#ffffff', border: '1px solid #e2e8f0',
    color: '#0f172a', fontSize: 14, outline: 'none',
  };

  return (
    <DashboardLayout title="Platform Settings" subtitle="Configure global platform settings">
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
          Configuration
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Core platform settings</h2>
      </div>
      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: 18, padding: 28,
        boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
        maxWidth: 700,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { label: 'Platform Name', key: 'platformName', type: 'text' },
            { label: 'Site URL', key: 'siteUrl', type: 'text' },
            { label: 'Support Email', key: 'supportEmail', type: 'email' },
            { label: 'Max Events Per User', key: 'maxEvents', type: 'text' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>{field.label}</label>
              <input
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                style={inputStyle}
              />
            </div>
          ))}

          {[
            { label: 'Open Registration', key: 'registration' },
            { label: 'Maintenance Mode', key: 'maintenance' },
            { label: 'AI Features Enabled', key: 'aiEnabled' },
          ].map(toggle => (
            <div key={toggle.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 14, color: '#475569' }}>{toggle.label}</span>
              <button
                onClick={() => setForm({ ...form, [toggle.key]: !form[toggle.key] })}
                style={{
                  width: 48, height: 26, borderRadius: 13,
                  background: form[toggle.key] ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : '#e2e8f0',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: 11, background: '#ffffff',
                  position: 'absolute', top: 2,
                  left: form[toggle.key] ? 24 : 2,
                  transition: 'left 0.2s',
                }} />
              </button>
            </div>
          ))}
        </div>

        <button style={{
          marginTop: 24, padding: '12px 32px', borderRadius: 10,
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          boxShadow: '0 12px 26px rgba(37,99,235,0.22)',
        }}>
          Save Settings
        </button>
      </div>
    </DashboardLayout>
  );
}