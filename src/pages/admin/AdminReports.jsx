import { useEffect, useMemo } from 'react';
import { Download } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAttendanceStore from '../../store/attendanceStore';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import useJudgeStore from '../../store/judgeStore';
import useRegistrationStore from '../../store/registrationStore';
import useScoreStore from '../../store/scoreStore';

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function bytesFor(payload) {
  return new Blob([JSON.stringify(payload)]).size;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminReports() {
  const { users, refreshProfiles } = useAuthStore();
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

  const reports = useMemo(() => {
    const scoreRows = Object.values(scores || {});
    const generatedAt = new Date().toISOString();
    return [
      { key: 'users', name: 'User Records Export', type: 'JSON', generatedAt, payload: { generatedAt, users } },
      { key: 'events', name: 'Event Flow Export', type: 'JSON', generatedAt, payload: { generatedAt, events, registrations, attendance } },
      { key: 'scores', name: 'Score and Judge Export', type: 'JSON', generatedAt, payload: { generatedAt, scores: scoreRows, judges, assignments } },
      { key: 'system', name: 'Full Admin Snapshot', type: 'JSON', generatedAt, payload: { generatedAt, users, events, registrations, attendance, scores: scoreRows, judges, assignments } },
    ].map((report) => ({ ...report, size: formatBytes(bytesFor(report.payload)), status: 'generated from current data' }));
  }, [assignments, attendance, events, judges, registrations, scores, users]);

  return (
    <DashboardLayout title="Reports" subtitle="Generate downloadable reports from current system data">
      <div style={toolbarStyle}>
        {reports.map((report) => (
          <button key={report.key} onClick={() => downloadJson(`fairplay-${report.key}-report.json`, report.payload)} style={primaryButtonStyle}>
            Generate {report.key} Report
          </button>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Report Name', 'Type', 'Generated', 'Size', 'Status', 'Actions'].map((header) => (
                  <th key={header} style={thStyle}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.key} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{report.name}</td>
                  <td style={{ padding: '12px 16px' }}><span style={pillStyle}>{report.type}</span></td>
                  <td style={tdStyle}>{new Date(report.generatedAt).toLocaleString()}</td>
                  <td style={tdStyle}>{report.size}</td>
                  <td style={{ padding: '12px 16px' }}><span style={statusStyle}>{report.status}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => downloadJson(`fairplay-${report.key}-report.json`, report.payload)} style={downloadButtonStyle}>
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

const toolbarStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(15,23,42,0.06)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 24 };
const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' };
const primaryButtonStyle = { padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 10px 26px rgba(37,99,235,0.22)' };
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#64748b' };
const pillStyle = { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(59,130,246,0.12)', color: '#2563eb' };
const statusStyle = { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,0.12)', color: '#2563eb' };
const downloadButtonStyle = { padding: '6px 14px', borderRadius: 8, background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)', color: '#2563eb', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 };
