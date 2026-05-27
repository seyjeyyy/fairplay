import { useState } from 'react';
import { Database, Zap, AlertTriangle, RotateCcw } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminBackup() {
  const backups = [
    { id: 1, name: 'Full System Backup', date: '2025-05-20 03:00', size: '2.8 GB', type: 'Full', status: 'completed' },
    { id: 2, name: 'Database Backup', date: '2025-05-19 03:00', size: '1.2 GB', type: 'Incremental', status: 'completed' },
    { id: 3, name: 'Media Files Backup', date: '2025-05-18 03:00', size: '4.5 GB', type: 'Full', status: 'completed' },
  ];

  return (
    <DashboardLayout title="Backup & Restore" subtitle="Manage system backups and restore points">
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 26px rgba(37,99,235,0.22)' }}>
          <Zap size={16} />
          Create Full Backup
        </button>
        <button style={{ padding: '10px 20px', borderRadius: 10, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} />
          Restore from Backup
        </button>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              {['Backup Name', 'Date', 'Size', 'Type', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backups.map(b => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', color: '#2563eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Database size={14} />
                  </span>
                  {b.name}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{b.date}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{b.size}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: b.type === 'Full' ? 'rgba(37,99,235,0.12)' : 'rgba(14,165,233,0.12)', color: b.type === 'Full' ? '#2563eb' : '#0284c7' }}>{b.type}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}>{b.status}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <RotateCcw size={14} />
                    Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}