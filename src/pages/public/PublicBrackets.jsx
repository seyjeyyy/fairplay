import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import LiveBracket from '../../components/brackets/LiveBracket';
import useEventStore from '../../store/eventStore';
import useTournamentStore from '../../store/tournamentStore';
import { isSupabaseConfigured, subscribeToTable } from '../../utils/supabaseClient';

export default function PublicBrackets() {
  const { id } = useParams();
  const { events, fetchEvents } = useEventStore();
  const { tournaments, fetchTournaments } = useTournamentStore();

  useEffect(() => {
    fetchEvents();
    fetchTournaments(id);

    const intervalId = window.setInterval(() => {
      fetchTournaments(id);
    }, 10000);

    const unsubscribe = isSupabaseConfigured
      ? subscribeToTable({
          table: 'tournaments',
          filter: `event_id=eq.${id}`,
          onChange: () => fetchTournaments(id),
        })
      : () => {};

    return () => {
      window.clearInterval(intervalId);
      unsubscribe();
    };
  }, [fetchEvents, fetchTournaments, id]);

  const event = events.find((entry) => String(entry.id) === String(id)) || null;
  const tournament = tournaments.find((entry) => String(entry.eventId) === String(id)) || null;
  const canViewBracket = tournament && (tournament.isPublished || tournament.liveStatus === 'completed');

  return (
    <div style={{ minHeight: '100vh', background: '#020817' }}>
      <header style={{ height: 70, background: 'rgba(15,20,25,0.95)', borderBottom: '1px solid rgba(6,182,212,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #06b6d4, #0084ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#000' }}>F</span>
          <span style={{ fontSize: 20, fontWeight: 800, background: 'linear-gradient(135deg, #fff, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FairPlay</span>
        </Link>
        <div style={{ display: 'flex', gap: 12 }}>
          {event ? (
            <Link to={`/events/${id}`} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4', fontWeight: 600, fontSize: 13, textDecoration: 'none' }}>
              Back to Event
            </Link>
          ) : null}
        </div>
      </header>
      <main style={{ paddingTop: 70 }}>
        <div style={{ maxWidth: 1480, margin: '0 auto', padding: '40px 24px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, color: '#f8fbff' }}>
            {event?.title || 'Tournament Brackets'}
          </h1>
          <p style={{ color: '#a0aec0', marginBottom: 32 }}>
            Live bracket progression for spectators, judges, and teams.
          </p>
          {canViewBracket ? (
            <LiveBracket tournament={tournament} />
          ) : (
            <div style={{ background: 'rgba(15,20,25,0.6)', border: '1px solid rgba(6,182,212,0.1)', borderRadius: 16, padding: 40, textAlign: 'center' }}>
              <span style={{ fontSize: 22, letterSpacing: '0.18em', marginBottom: 16, display: 'block', color: '#67e8f9', fontWeight: 800 }}>
                <i className="bi bi-diagram-3" /> BRACKET
              </span>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#f8fbff' }}>Tournament Bracket</h3>
              <p style={{ color: '#a0aec0', fontSize: 14, marginBottom: 20 }}>
                {tournament
                  ? 'The organizer has not published this bracket yet.'
                  : 'The organizer has not created a bracket for this event yet.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
