import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEventStore from '../../store/eventStore';
import useScoreStore from '../../store/scoreStore';

export default function PublicLeaderboard() {
  const { id } = useParams();
  const { events, fetchEvents } = useEventStore();
  const { fetchScores, calculateLeaderboard } = useScoreStore();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        await Promise.all([fetchEvents(), fetchScores(id)]);
      } finally {
        if (mounted) setLoaded(true);
      }
    }
    load();
    return () => { mounted = false; };
  }, [fetchEvents, fetchScores, id]);

  const event = events.find((entry) => String(entry.id) === String(id)) || null;
  const contestants = Array.isArray(event?.contestants) ? event.contestants : [];
  const leaderboard = useMemo(() => {
    if (!event) return [];
    const ranked = calculateLeaderboard(event.id, event.criteria || []);
    if (ranked.length > 0) return ranked;
    return contestants.map((contestant, index) => ({
      rank: index + 1,
      contestantId: contestant.id,
      contestantName: contestant.name || contestant.teamName || `Participant ${index + 1}`,
      averageScore: null,
      totalScores: 0,
    }));
  }, [calculateLeaderboard, contestants, event]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f8fbff,#eff6ff)', color: '#0f172a' }}>
      <header style={{ height: 72, background: 'rgba(255,255,255,0.94)', borderBottom: '1px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(16px)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900 }}>F</span>
          <span style={{ color: '#0f172a', fontSize: 20, fontWeight: 900 }}>FairPlay</span>
        </Link>
        <Link to={`/events/${id}`} style={{ padding: '9px 16px', borderRadius: 12, border: '1px solid #bfdbfe', color: '#1d4ed8', fontWeight: 800, fontSize: 13, textDecoration: 'none', background: '#eff6ff' }}>Event Preview</Link>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '42px 24px 72px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ color: '#2563eb', fontSize: 12, fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 8 }}>Audience Leaderboard</p>
          <h1 style={{ fontSize: 'clamp(30px,5vw,48px)', fontWeight: 950, letterSpacing: '-0.04em', margin: 0 }}>{event?.title || 'Event'} Rankings</h1>
          <p style={{ color: '#64748b', marginTop: 10 }}>{loaded ? 'Live scores and ranking updates from submitted judge scores.' : 'Loading leaderboard...'}</p>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 24, overflow: 'hidden', boxShadow: '0 22px 60px rgba(37,99,235,0.10)' }}>
          {leaderboard.length > 0 ? leaderboard.map((item, index) => (
            <motion.div
              key={item.contestantId || item.rank}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '18px 22px', borderBottom: index < leaderboard.length - 1 ? '1px solid #e0ecff' : 'none', background: item.rank === 1 ? '#fffbeb' : index % 2 === 0 ? '#f8fbff' : '#fff' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <span style={{ width: 46, height: 46, borderRadius: 16, background: item.rank === 1 ? '#fef3c7' : item.rank === 2 ? '#e2e8f0' : item.rank === 3 ? '#fed7aa' : '#eff6ff', color: item.rank === 1 ? '#b45309' : '#1d4ed8', display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 950, flex: '0 0 auto' }}>
                  #{item.rank}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 900, fontSize: 16, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.contestantName}</p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0' }}>{item.totalScores ? `${item.totalScores} submitted score${item.totalScores === 1 ? '' : 's'}` : 'Waiting for scores'}</p>
                </div>
              </div>
              <span style={{ fontSize: 28, fontWeight: 950, color: item.rank === 1 ? '#b45309' : '#2563eb' }}>
                {item.averageScore !== null ? item.averageScore.toFixed(2) : '--'}
              </span>
            </motion.div>
          )) : (
            <div style={{ padding: 42, textAlign: 'center', color: '#64748b' }}>
              <i className="bi bi-bar-chart" style={{ fontSize: 42, color: '#2563eb', display: 'block', marginBottom: 12 }} />
              No leaderboard data yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
