import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEventStore from '../../store/eventStore';
import useTournamentStore from '../../store/tournamentStore';

export default function PublicEventView() {
  const { id } = useParams();
  const { events, fetchEvents } = useEventStore();
  const { tournaments, fetchTournaments } = useTournamentStore();

  useEffect(() => {
    fetchEvents();
    fetchTournaments(id);
  }, [fetchEvents, fetchTournaments, id]);

  const event = events.find((entry) => String(entry.id) === String(id)) || null;
  const tournament = tournaments.find((entry) => String(entry.eventId) === String(id)) || null;

  if (!event) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 40 }}>
        <span style={{ fontSize: 48, color: '#67e8f9' }}>
          <i className="bi bi-search" />
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Event Not Found</h1>
        <p style={{ color: '#a0aec0' }}>The event you are looking for does not exist.</p>
        <Link to="/" style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', color: '#000', fontWeight: 700, textDecoration: 'none' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const detailItems = [
    { label: 'Date', value: `${event.startDate || 'TBD'} to ${event.endDate || 'TBD'}` },
    { label: 'Participants', value: `${event.participants || 0} / ${event.maxParticipants || 'Open'}` },
    { label: 'Location', value: event.location || 'TBD' },
    { label: 'Bracket Status', value: tournament?.isPublished ? 'Published' : tournament ? 'Draft' : 'Not created' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <header style={{ height: 70, background: 'rgba(15,20,25,0.95)', borderBottom: '1px solid rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#000' }}>F</span>
          <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FairPlay</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/?modal=login" style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </header>

      <main style={{ paddingTop: 70 }}>
        <div style={{ maxWidth: 940, margin: '0 auto', padding: '40px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{event.title}</h1>
                <p style={{ color: '#a0aec0', fontSize: 15 }}>{event.type} · {event.location || 'Location pending'}</p>
              </div>
              <span style={{ padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: event.status === 'active' ? 'rgba(16,185,129,0.15)' : event.status === 'completed' ? 'rgba(107,114,128,0.15)' : 'rgba(6,182,212,0.15)', color: event.status === 'active' ? '#10b981' : event.status === 'completed' ? '#94a3b8' : '#06b6d4' }}>
                {event.status}
              </span>
            </div>

            <div style={{ background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Event Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {detailItems.map((item) => (
                  <div key={item.label} style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8 }}>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{item.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to={`/events/${id}/brackets`} style={{ flex: 1, minWidth: 220, padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', color: '#000', fontWeight: 700, fontSize: 14, textAlign: 'center', textDecoration: 'none' }}>
                <i className="bi bi-diagram-3" /> View Brackets
              </Link>
              <Link to={`/events/${id}/leaderboard`} style={{ flex: 1, minWidth: 220, padding: '12px', borderRadius: 10, background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontWeight: 700, fontSize: 14, textAlign: 'center', textDecoration: 'none' }}>
                <i className="bi bi-bar-chart-line" /> Leaderboard
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
