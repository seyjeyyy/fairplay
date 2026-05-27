import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function JudgeSettings() {
  const [form, setForm] = useState({ name: 'Judge User', email: 'judge@fairplay.com', specialty: 'Technical', mobileView: true });

  return (
    <DashboardLayout title="Profile Settings" subtitle="Manage your judging profile">
      <div style={{ background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 16, padding: 28, maxWidth: 600 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['name', 'email', 'specialty'].map(f => (
            <div key={f}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
              <input value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span style={{ fontSize: 14, color: '#a0aec0' }}>Mobile-Optimized View</span>
            <button onClick={() => setForm({ ...form, mobileView: !form.mobileView })} style={{ width: 48, height: 26, borderRadius: 13, background: form.mobileView ? 'linear-gradient(135deg, #06b6d4, #0084ff)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 2, left: form.mobileView ? 24 : 2, transition: 'left 0.2s' }} />
            </button>
          </div>
        </div>
        <button style={{ marginTop: 24, padding: '12px 32px', borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', color: '#000', border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Save Changes</button>
      </div>
    </DashboardLayout>
  );
}