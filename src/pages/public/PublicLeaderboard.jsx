import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEventStore from '../../store/eventStore';

export default function PublicLeaderboard() {
  const { id } = useParams();
  const { events } = useEventStore();
  const event = events.find(e => e.id === Number(id));

  const leaderboard = [
    { rank: 1, name: 'Team Alpha', score: 9850, badge: '🥇' },
    { rank: 2, name: 'Digital Warriors', score: 9420, badge: '🥈' },
    { rank: 3, name: 'Code Ninjas', score: 8990, badge: '🥉' },
    { rank: 4, name: 'Storm Breakers', score: 8640, badge: '🏅' },
    { rank: 5, name: 'Phoenix Rising', score: 8210, badge: '🏅' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <header style={{ height: 70, background: 'rgba(15,20,25,0.95)', borderBottom: '1px solid rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#000' }}>F</span>
          <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FairPlay</span>
        </Link>
        <Link to="/?modal=login" style={{ padding: '8px 20px', borderRadius: 8, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', color: '#000', fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>Sign In</Link>
      </header>
      <main style={{ paddingTop: 70 }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{event?.title || 'Event'} Leaderboard</h1>
            <p style={{ color: '#a0aec0' }}>Live rankings and scores</p>
          </div>

          <div style={{ background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 16, overflow: 'hidden' }}>
            {leaderboard.map((item, i) => (
              <motion.div
                key={item.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < leaderboard.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: item.rank === 1 ? 'rgba(255,215,0,0.04)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: item.rank <= 3 ? `rgba(${['255,215,0','192,192,192','205,127,50'][item.rank - 1]},0.15)` : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800,
                  }}>
                    {item.badge}
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#666' }}>Rank #{item.rank}</p>
                  </div>
                </div>
                <span style={{ fontSize: 24, fontWeight: 900, color: item.rank === 1 ? '#fbbf24' : item.rank === 2 ? '#94a3b8' : item.rank === 3 ? '#d97706' : '#06b6d4' }}>
                  {item.score.toLocaleString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}