import { useState } from 'react';
import { Download } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminReports() {
  const reports = [
    { name: 'Monthly Activity Report', type: 'PDF', date: '2025-05-01', size: '2.4 MB', status: 'ready' },
    { name: 'User Growth Analytics', type: 'CSV', date: '2025-04-28', size: '1.8 MB', status: 'ready' },
    { name: 'Event Performance Summary', type: 'PDF', date: '2025-04-25', size: '3.2 MB', status: 'ready' },
    { name: 'Score Distribution Analysis', type: 'CSV', date: '2025-04-20', size: '856 KB', status: 'ready' },
  ];

  return (
    <DashboardLayout title="Reports" subtitle="Generate and download platform reports">
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 24,
      }}>
        {['Generate User Report', 'Generate Event Report', 'Generate Score Report'].map(label => (
          <button key={label} style={{
            padding: '10px 20px', borderRadius: 10,
            background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
            color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
            boxShadow: '0 10px 26px rgba(37,99,235,0.22)',
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{
        background: '#ffffff', border: '1px solid #e2e8f0',
        borderRadius: 18, padding: 24,
        boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Report Name', 'Type', 'Date', 'Size', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{r.name}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: r.type === 'PDF' ? 'rgba(59,130,246,0.12)' : 'rgba(14,165,233,0.12)', color: r.type === 'PDF' ? '#2563eb' : '#0284c7' }}>{r.type}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{r.date}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{r.size}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}>{r.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <Download size={14} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}