import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  BarChart3,
  Scale,
  Target,
  CheckCircle2,
  TrendingUp,
  UserRound,
  Trophy,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState('7d');
  const metrics = {
    '7d': { users: 342, events: 12, scores: 1247, judges: 45, avgScore: 87.3, completion: 94 },
    '30d': { users: 1284, events: 47, scores: 3842, judges: 156, avgScore: 85.7, completion: 91 },
    '90d': { users: 3542, events: 128, scores: 10247, judges: 412, avgScore: 84.2, completion: 88 },
  };
  const data = metrics[timeframe];

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
  };

  return (
    <DashboardLayout title="System Analytics" subtitle="Deep platform analytics and metrics">
      {/* Timeframe Selector */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
        marginBottom: 24,
      }}>
        <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8' }}>
          Timeframe
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['7d', '30d', '90d'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '8px 16px', borderRadius: 10, border: '1px solid',
                borderColor: timeframe === t ? '#2563eb' : '#e2e8f0',
                background: timeframe === t ? 'rgba(37,99,235,0.12)' : '#ffffff',
                color: timeframe === t ? '#2563eb' : '#475569',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}
            >
              {t === '7d' ? '7 Days' : t === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Active Users', value: data.users, icon: Users, color: '#2563eb' },
          { label: 'Events Created', value: data.events, icon: Calendar, color: '#1d4ed8' },
          { label: 'Scores Submitted', value: data.scores, icon: BarChart3, color: '#0ea5e9' },
          { label: 'Active Judges', value: data.judges, icon: Scale, color: '#2563eb' },
          { label: 'Avg Score', value: `${data.avgScore}%`, icon: Target, color: '#1d4ed8' },
          { label: 'Completion Rate', value: `${data.completion}%`, icon: CheckCircle2, color: '#0ea5e9' },
        ].map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ ...cardStyle, padding: 20, borderLeft: `3px solid ${m.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{m.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.value}</p>
              </div>
              <span style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(37,99,235,0.08)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                <m.icon size={18} />
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
            <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <TrendingUp size={16} />
            </span>
            Event Creation Trend
          </h3>
          <div style={{
            height: 200, display: 'flex', alignItems: 'flex-end', gap: 8,
            padding: '20px 0', borderBottom: '1px solid #e2e8f0',
          }}>
            {[35, 52, 41, 68, 55, 72, 88, 65, 45, 59, 78, 92].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${v * 2}px` }}
                  style={{
                    width: '100%', maxWidth: 30,
                    background: 'linear-gradient(180deg, #60a5fa, #2563eb)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: 9, color: '#64748b' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={cardStyle}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
            <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
              <UserRound size={16} />
            </span>
            User Growth
          </h3>
          <div style={{
            height: 200, display: 'flex', alignItems: 'flex-end', gap: 8,
            padding: '20px 0', borderBottom: '1px solid #e2e8f0',
          }}>
            {[120, 180, 240, 310, 420, 560, 720, 890, 1050, 1180, 1350, 1540].map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${v / 8}px` }}
                  style={{
                    width: '100%', maxWidth: 30,
                    background: 'linear-gradient(180deg, #93c5fd, #2563eb)',
                    borderRadius: '4px 4px 0 0',
                  }}
                />
                <span style={{ fontSize: 9, color: '#64748b' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Events */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
          <span style={{ width: 28, height: 28, borderRadius: 10, background: 'rgba(37,99,235,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
            <Trophy size={16} />
          </span>
          Top Performing Events
        </h3>
        {[
          { name: 'National Coding Challenge', participants: 128, score: 95, judges: 8 },
          { name: 'Valorant Championship', participants: 64, score: 92, judges: 6 },
          { name: 'Basketball Tournament', participants: 256, score: 88, judges: 12 },
          { name: 'Debate Cup', participants: 32, score: 85, judges: 4 },
        ].map((event, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', borderBottom: i < 3 ? '1px solid #f1f5f9' : 'none',
            background: i % 2 === 0 ? '#f8fafc' : 'transparent',
            borderRadius: 8,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: `rgba(37,99,235,${0.1 + i * 0.05})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#2563eb',
              }}>
                #{i + 1}
              </span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{event.name}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#64748b' }}>
              <span>{event.participants} participants</span>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>{event.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
