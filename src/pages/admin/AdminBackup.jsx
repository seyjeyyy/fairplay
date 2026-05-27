import { useEffect, useMemo } from 'react';
import { Database, Download, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAttendanceStore from '../../store/attendanceStore';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import useJudgeStore from '../../store/judgeStore';
import useRegistrationStore from '../../store/registrationStore';
import useScoreStore from '../../store/scoreStore';

function exportSnapshot(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `fairplay-backup-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function sizeOf(payload) {
  const bytes = new Blob([JSON.stringify(payload)]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminBackup() {
  const { users, refreshProfiles, authMode } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const { judges, assignments, fetchJudges } = useJudgeStore();
  const { registrations, fetchRegistrations } = useRegistrationStore();
  const { scores, fetchScores } = useScoreStore();
  const { attendance, fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    refreshProfiles();
    fetchEvents();
    fetchJudges();
    fetchRegistrations();
    fetchScores();
    fetchAttendance();
  }, [fetchAttendance, fetchEvents, fetchJudges, fetchRegistrations, fetchScores, refreshProfiles]);

  const snapshot = useMemo(() => ({
    generatedAt: new Date().toISOString(),
    authMode,
    users,
    events,
    judges,
    judgeAssignments: assignments,
    registrations,
    scores: Object.values(scores || {}),
    attendance,
  }), [assignments, attendance, authMode, events, judges, registrations, scores, users]);

  const backupRows = [
    { name: 'Current System Snapshot', date: snapshot.generatedAt, size: sizeOf(snapshot), type: 'JSON Export', status: 'available now' },
  ];

  return (
    <DashboardLayout title="Backup & Restore" subtitle="Export current database-backed app data">
      <div style={toolbarStyle}>
        <button onClick={() => exportSnapshot(snapshot)} style={primaryButtonStyle}>
          <Download size={16} />
          Export Current Backup
        </button>
        <div style={warningStyle}>
          <AlertTriangle size={16} />
          Restore is disabled because no restore endpoint/table is configured in this app.
        </div>
      </div>

      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
              {['Backup Name', 'Generated', 'Size', 'Type', 'Status', 'Actions'].map((header) => (
                <th key={header} style={thStyle}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {backupRows.map((backup) => (
              <tr key={backup.name} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={iconStyle}><Database size={14} /></span>
                  {backup.name}
                </td>
                <td style={tdStyle}>{new Date(backup.date).toLocaleString()}</td>
                <td style={tdStyle}>{backup.size}</td>
                <td style={{ padding: '12px 16px' }}><span style={pillStyle}>{backup.type}</span></td>
                <td style={{ padding: '12px 16px' }}><span style={statusStyle}>{backup.status}</span></td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => exportSnapshot(snapshot)} style={downloadButtonStyle}>
                    <Download size={14} />
                    Export
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

const toolbarStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(15,23,42,0.06)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 };
const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)', overflowX: 'auto' };
const primaryButtonStyle = { padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 10px 26px rgba(37,99,235,0.22)' };
const warningStyle = { padding: '10px 14px', borderRadius: 10, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.35)', color: '#b45309', fontWeight: 700, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 8 };
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#64748b' };
const iconStyle = { width: 28, height: 28, borderRadius: 8, background: 'rgba(37,99,235,0.12)', color: '#2563eb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const pillStyle = { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,0.12)', color: '#2563eb' };
const statusStyle = { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,0.12)', color: '#2563eb' };
const downloadButtonStyle = { padding: '6px 14px', borderRadius: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 };
