import { useEffect, useMemo } from 'react';
import { Check, Database, Receipt } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';

function usagePercent(value, limit) {
  if (!limit) return 0;
  return Math.min(100, Math.round((value / limit) * 100));
}

export default function AdminSubscriptions() {
  const { users, refreshProfiles, authMode } = useAuthStore();
  const { events, fetchEvents } = useEventStore();

  useEffect(() => {
    refreshProfiles();
    fetchEvents();
  }, [fetchEvents, refreshProfiles]);

  const usage = useMemo(() => {
    const organizerCount = users.filter((user) => user.role === 'organizer').length;
    const judgeCount = users.filter((user) => user.role === 'judge').length;
    return {
      totalUsers: users.length,
      organizerCount,
      judgeCount,
      totalEvents: events.length,
      activeEvents: events.filter((event) => ['active', 'ongoing', 'upcoming'].includes(event.status)).length,
    };
  }, [events, users]);

  const planLimits = {
    users: Number(import.meta.env.VITE_PLAN_USER_LIMIT || 0),
    events: Number(import.meta.env.VITE_PLAN_EVENT_LIMIT || 0),
  };

  const usageCards = [
    { label: 'Users in Database', value: usage.totalUsers, limit: planLimits.users, detail: `${usage.organizerCount} organizers, ${usage.judgeCount} judges` },
    { label: 'Events in Database', value: usage.totalEvents, limit: planLimits.events, detail: `${usage.activeEvents} active/upcoming events` },
  ];

  return (
    <DashboardLayout title="Subscriptions & Billing" subtitle="Live billing usage from current users and events">
      <div style={{ marginBottom: 18 }}>
        <p style={eyebrowStyle}>Current Usage</p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Database-backed subscription overview</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div style={cardStyle}>
          <div style={iconStyle}><Database size={18} /></div>
          <h3 style={titleStyle}>Billing Source</h3>
          <p style={valueStyle}>{authMode}</p>
          <p style={detailStyle}>Showing actual records available to the app. No billing table is configured in this codebase.</p>
        </div>
        {usageCards.map((item) => {
          const percent = usagePercent(item.value, item.limit);
          return (
            <div key={item.label} style={cardStyle}>
              <div style={iconStyle}><Check size={18} /></div>
              <h3 style={titleStyle}>{item.label}</h3>
              <p style={valueStyle}>{item.value}{item.limit ? ` / ${item.limit}` : ''}</p>
              <p style={detailStyle}>{item.detail}</p>
              {item.limit ? (
                <div style={barTrackStyle}><div style={{ ...barFillStyle, width: `${percent}%` }} /></div>
              ) : (
                <p style={{ ...detailStyle, color: '#b45309' }}>No plan limit configured in environment.</p>
              )}
            </div>
          );
        })}
      </div>

      <div style={cardStyle}>
        <h3 style={{ ...titleStyle, display: 'flex', alignItems: 'center', gap: 8 }}><Receipt size={18} /> Billing Records</h3>
        <div style={emptyStyle}>No billing records table or subscription invoices are connected yet, so no fake plans or prices are displayed.</div>
      </div>
    </DashboardLayout>
  );
}

const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' };
const eyebrowStyle = { fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 };
const iconStyle = { width: 38, height: 38, borderRadius: 12, background: 'rgba(37,99,235,0.10)', color: '#2563eb', display: 'grid', placeItems: 'center', marginBottom: 12 };
const titleStyle = { fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 8 };
const valueStyle = { fontSize: 30, fontWeight: 900, color: '#2563eb', marginBottom: 8 };
const detailStyle = { fontSize: 13, color: '#64748b', lineHeight: 1.5 };
const barTrackStyle = { height: 8, borderRadius: 999, background: '#dbeafe', overflow: 'hidden', marginTop: 12 };
const barFillStyle = { height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #2563eb, #0ea5e9)' };
const emptyStyle = { padding: 28, borderRadius: 14, background: '#f8fafc', border: '1px dashed #cbd5e1', color: '#64748b', textAlign: 'center' };
