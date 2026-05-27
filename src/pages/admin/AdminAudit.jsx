import { useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAILogsStore from '../../store/aiLogsStore';
import useAttendanceStore from '../../store/attendanceStore';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import useRegistrationStore from '../../store/registrationStore';
import useScoreStore from '../../store/scoreStore';

function makeLog({ user = 'System', action, target, timestamp, source }) {
  return { user, action, target, timestamp: timestamp || new Date().toISOString(), source };
}

function formatTimestamp(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value || 'Unknown') : date.toLocaleString();
}

export default function AdminAudit() {
  const { users, refreshProfiles } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const { registrations, fetchRegistrations } = useRegistrationStore();
  const { scores, fetchScores } = useScoreStore();
  const { attendance, fetchAttendance } = useAttendanceStore();
  const { logs: aiLogs } = useAILogsStore();

  useEffect(() => {
    refreshProfiles();
    fetchEvents();
    fetchRegistrations();
    fetchScores();
    fetchAttendance();
  }, [fetchAttendance, fetchEvents, fetchRegistrations, fetchScores, refreshProfiles]);

  const logs = useMemo(() => {
    const scoreRows = Object.values(scores || {});
    return [
      ...events.map((event) => makeLog({
        user: event.organizerEmail || users.find((user) => String(user.id) === String(event.organizer_id))?.email || 'Organizer',
        action: `Created or updated event: ${event.title}`,
        target: 'Event',
        timestamp: event.createdAt || event.created_at || event.startDate,
        source: 'events',
      })),
      ...registrations.map((registration) => makeLog({
        user: registration.email || registration.participantName || 'Participant',
        action: `Registered for event ${registration.eventId}`,
        target: 'Registration',
        timestamp: registration.createdAt,
        source: 'registrations',
      })),
      ...scoreRows.map((score) => makeLog({
        user: score.judgeName || score.judgeId || 'Judge',
        action: `Submitted score for ${score.contestantName}`,
        target: 'Score',
        timestamp: score.timestamp,
        source: 'scores',
      })),
      ...attendance.map((row) => makeLog({
        user: row.scannerId || row.attendeeName || 'Attendance Scanner',
        action: `Checked in ${row.attendeeName}`,
        target: 'Attendance',
        timestamp: row.checkedInAt,
        source: 'attendance',
      })),
      ...aiLogs.map((log) => makeLog({
        user: log.eventTitle || 'AI Service',
        action: `${log.success ? 'Generated' : 'Failed'} AI criteria request`,
        target: 'AI',
        timestamp: log.timestamp,
        source: 'ai_logs',
      })),
    ].sort((left, right) => new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime());
  }, [aiLogs, attendance, events, registrations, scores, users]);

  return (
    <DashboardLayout title="Audit Logs" subtitle="Live platform activity derived from database-backed modules">
      <div style={{ marginBottom: 18 }}>
        <p style={eyebrowStyle}>Activity</p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Latest system actions</h2>
      </div>
      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['User', 'Action', 'Target', 'Timestamp', 'Source'].map((header) => (
                  <th key={header} style={thStyle}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="5" style={emptyCellStyle}>No database activity found yet.</td></tr>
              ) : logs.slice(0, 100).map((log, index) => (
                <tr key={`${log.source}-${index}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{log.user}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#475569' }}>{log.action}</td>
                  <td style={{ padding: '12px 16px' }}><span style={pillStyle}>{log.target}</span></td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{formatTimestamp(log.timestamp)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>{log.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' };
const eyebrowStyle = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 };
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const pillStyle = { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,0.12)', color: '#2563eb' };
const emptyCellStyle = { padding: 32, textAlign: 'center', color: '#94a3b8' };
