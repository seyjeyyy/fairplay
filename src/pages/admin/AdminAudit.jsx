import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminAudit() {
  const [logs] = useState([
    { user: 'Admin', action: 'Created event: National Coding Challenge', target: 'Event', timestamp: '2025-05-20 14:32:01', ip: '192.168.1.1' },
    { user: 'Organizer User', action: 'Updated scoring criteria', target: 'Criteria', timestamp: '2025-05-20 13:15:42', ip: '192.168.1.2' },
    { user: 'Judge User', action: 'Submitted scores for 5 participants', target: 'Score', timestamp: '2025-05-20 12:00:15', ip: '192.168.1.3' },
    { user: 'Admin', action: 'Modified user role: jane@example.com', target: 'User', timestamp: '2025-05-19 16:45:30', ip: '192.168.1.1' },
    { user: 'System', action: 'Auto-generated bracket for Basketball', target: 'System', timestamp: '2025-05-19 10:00:00', ip: 'system' },
  ]);

  return (
    <DashboardLayout title="Audit Logs" subtitle="Track all platform activities">
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
          Activity
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Latest system actions</h2>
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
                {['User', 'Action', 'Target', 'Timestamp', 'IP Address'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{log.user}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{log.action}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'rgba(37,99,235,0.12)', color: '#2563eb' }}>{log.target}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{log.timestamp}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}