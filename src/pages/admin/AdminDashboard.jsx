import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Trophy,
  CheckCircle2,
  Scale,
  UserRound,
  Zap,
  BarChart3,
  Database,
  LineChart,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useEventStore from '../../store/eventStore';

const ANALYTICS = {
  totalUsers: 1284, activeEvents: 12, totalEvents: 47,
  completedEvents: 28, systemUptime: '99.9%', totalScores: 3842,
  activeJudges: 156, totalParticipants: 3842,
};

const STORAGE = {
  used: '2.4 GB', total: '10 GB', percentage: 24,
};

export default function AdminDashboard() {
  const { events, fetchEvents } = useEventStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const overviewStats = [
    { label: 'Total Users', value: ANALYTICS.totalUsers, icon: Users, color: '#2563eb' },
    { label: 'Active Events', value: ANALYTICS.activeEvents, icon: Calendar, color: '#1d4ed8' },
    { label: 'Total Events', value: ANALYTICS.totalEvents, icon: Trophy, color: '#3b82f6' },
    { label: 'Total Scores', value: ANALYTICS.totalScores, icon: BarChart3, color: '#2563eb' },
  ];

  const operationsStats = [
    { label: 'Completed', value: ANALYTICS.completedEvents, icon: CheckCircle2, color: '#0ea5e9' },
    { label: 'Active Judges', value: ANALYTICS.activeJudges, icon: Scale, color: '#2563eb' },
    { label: 'Participants', value: ANALYTICS.totalParticipants, icon: UserRound, color: '#1d4ed8' },
    { label: 'System Uptime', value: ANALYTICS.systemUptime, icon: Zap, color: '#0ea5e9' },
  ];

  const filteredEvents = events.filter(e => {
    if (filter !== 'all' && e.status !== filter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  };

  const statsCardStyle = {
    ...cardStyle,
    padding: 20,
    minHeight: 110,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <DashboardLayout title="Super Admin Dashboard" subtitle="Complete platform oversight and analytics">
      <div style={{ display: 'grid', gap: 28 }}>
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Overview
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {overviewStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  ...statsCardStyle,
                  borderLeft: `3px solid ${stat.color}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{stat.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  </div>
                  <span style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(37,99,235,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    <stat.icon size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>
            Operations
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {operationsStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  ...statsCardStyle,
                  borderLeft: `3px solid ${stat.color}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                  <div>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{stat.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                  </div>
                  <span style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(37,99,235,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                    <stat.icon size={18} />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.3fr)', gap: 20, alignItems: 'start' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
                <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Database size={16} />
                </span>
                Storage Usage
              </h3>
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#64748b' }}>{STORAGE.used} used of {STORAGE.total}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: STORAGE.percentage > 80 ? '#ef4444' : '#2563eb' }}>
                    {STORAGE.percentage}%
                  </span>
                </div>
                <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${STORAGE.percentage}%` }}
                    style={{
                      height: '100%',
                      background: STORAGE.percentage > 80
                        ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                        : 'linear-gradient(90deg, #60a5fa, #2563eb)',
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={cardStyle}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
                <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <LineChart size={16} />
                </span>
                Platform Analytics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Avg Events/Day', value: '2.4' },
                  { label: 'Avg Score Time', value: '45s' },
                  { label: 'Active Users', value: '342' },
                  { label: 'AI Generations', value: '1,247' },
                ].map(item => (
                  <div key={item.label} style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{item.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
                <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                  <Calendar size={16} />
                </span>
                All Events
              </h3>
              <div style={{ display: 'flex', gap: 12 }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events..."
                  style={{
                    padding: '8px 14px', borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a', fontSize: 13, outline: 'none', width: 200,
                  }}
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '8px 14px', borderRadius: 10,
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#0f172a', fontSize: 13, outline: 'none',
                  }}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    {['Title', 'Type', 'Status', 'Participants', 'Date', 'Actions'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left',
                        fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event, i) => (
                    <motion.tr
                      key={event.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      style={{ borderBottom: '1px solid #f1f5f9' }}
                    >
                      <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{event.title}</td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{event.type}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                          background: event.status === 'active' ? 'rgba(37,99,235,0.12)' :
                            event.status === 'completed' ? 'rgba(148,163,184,0.18)' :
                            event.status === 'upcoming' ? 'rgba(14,165,233,0.12)' : 'rgba(59,130,246,0.12)',
                          color: event.status === 'active' ? '#1d4ed8' :
                            event.status === 'completed' ? '#64748b' :
                            event.status === 'upcoming' ? '#0284c7' : '#2563eb',
                        }}>
                          {event.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                        {event.participants}/{event.maxParticipants || '∞'}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
                        {event.startDate || '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button style={actionBtnStyle} aria-label="View">
                            <Eye size={16} />
                          </button>
                          <button style={actionBtnStyle} aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button style={{ ...actionBtnStyle, color: '#ef4444' }} aria-label="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const actionBtnStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#2563eb',
  padding: '6px 10px',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
};
