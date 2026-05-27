import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import useEventStore from '../../store/eventStore';
import useScoreStore from '../../store/scoreStore';
import SmartQRCode from '../../components/qr/SmartQRCode';

export default function ParticipantDashboard() {
  const { events, fetchEvents } = useEventStore();
  const { calculateLeaderboard } = useScoreStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openEvents = events.filter(e => e.status === 'active' || e.status === 'upcoming');

  const filteredEvents = openEvents.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle = {
    background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)',
    borderRadius: 16, padding: 24, backdropFilter: 'blur(8px)',
  };

  return (
    <DashboardLayout title="Participant Dashboard" subtitle="Browse events, register, and view your scores">
      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Open Events', value: openEvents.length, icon: '📅', color: '#06b6d4' },
          { label: 'Active Registrations', value: '3', icon: '✅', color: '#10b981' },
          { label: 'Completed Events', value: '5', icon: '🏆', color: '#9333ea' },
          { label: 'Your Ranking', value: '#2', icon: '📊', color: '#fbbf24' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            style={{ ...cardStyle, padding: 20, borderLeft: `3px solid ${stat.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>{stat.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</p>
              </div>
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* My Smart QR Pass */}
      <div style={{ ...cardStyle, marginBottom: 28, display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap', background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(0, 132, 255, 0.05))', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div>
          <SmartQRCode token="usr-token-55a2-9b41" size={140} />
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>My Universal Event Pass</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, marginBottom: '16px' }}>
            Show this Smart QR Code to organizers for fast check-in, or to judges when it's your turn to perform. It automatically routes the scanner to the correct interface based on their role.
          </p>
          <span className="badge badge-success">Active Pass</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ ...cardStyle, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events to join..."
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 10,
              background: 'rgba(15,20,25,0.8)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff', fontSize: 14, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Available Events */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          📅 Available Events
        </h3>

        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>📅</p>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#a0aec0', marginBottom: 4 }}>No events available</p>
            <p style={{ fontSize: 13 }}>Check back later for new events</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: 'rgba(15,20,25,0.5)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  borderRadius: 12, flexWrap: 'wrap', gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>
                      {event.type === 'esports' ? '🎮' :
                       event.type === 'singing' ? '🎤' :
                       event.type === 'dance' ? '💃' :
                       event.type === 'sportsfest' ? '🏅' :
                       event.type === 'academic' ? '📚' :
                       event.type === 'hackathon' ? '💻' :
                       event.type === 'pageant' ? '👑' : '🏆'}
                    </span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15 }}>{event.title}</p>
                      <p style={{ fontSize: 12, color: '#666' }}>
                        {event.startDate || 'TBD'} · {event.location || 'Online'}
                        · {event.participants}/{event.maxParticipants || '∞'} participants
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const route = event.type === 'tournament' || event.type === 'esports' || event.type === 'sportsfest'
                      ? 'team'
                      : 'individual';
                    navigate(`/participant/register-${route}?eventId=${event.id}`);
                  }}
                  style={{
                    padding: '10px 20px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #06b6d4, #0084ff)',
                    border: 'none', color: '#000', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Register Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard Preview */}
      <div style={{ ...cardStyle, marginTop: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          🏆 Live Leaderboard
        </h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {[
            { rank: 1, name: 'Team Alpha', score: 9850, badge: '🥇' },
            { rank: 2, name: 'Digital Warriors', score: 9420, badge: '🥈' },
            { rank: 3, name: 'Code Ninjas', score: 8990, badge: '🥉' },
            { rank: 4, name: 'Storm Breakers', score: 8640 },
            { rank: 5, name: 'Phoenix Rising', score: 8210 },
          ].map((entry, i) => (
            <motion.div
              key={entry.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                background: entry.rank <= 3 ? 'rgba(6,182,212,0.06)' : 'rgba(15,20,25,0.5)',
                border: entry.rank <= 3 ? '1px solid rgba(6,182,212,0.12)' : '1px solid rgba(255,255,255,0.04)',
                borderRadius: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: entry.rank <= 3 ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.04)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: entry.rank <= 3 ? '#06b6d4' : '#666',
                }}>
                  {entry.badge || entry.rank}
                </span>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{entry.name}</span>
              </div>
              <span style={{
                fontSize: 16, fontWeight: 700, color: '#10b981',
              }}>
                {entry.score}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
