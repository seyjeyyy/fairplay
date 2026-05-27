import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useRegistrationStore from '../../store/registrationStore';

export default function TeamRegistration() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    setEvent,
    teamName,
    setTeamName,
    roster,
    addPlayerToRoster,
    removePlayerFromRoster,
    submitBatchRegistration,
    status,
  } = useRegistrationStore();

  const [newPlayer, setNewPlayer] = useState({ name: '', position: '', number: '' });

  useEffect(() => {
    const eventId = searchParams.get('eventId');
    if (eventId) {
      setEvent(eventId, 'team');
    }
  }, [searchParams, setEvent]);

  const handleAddPlayer = (event) => {
    event.preventDefault();
    if (!newPlayer.name) return;
    addPlayerToRoster(newPlayer);
    setNewPlayer({ name: '', position: '', number: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!teamName || roster.length === 0) {
      alert('Please enter a team name and add at least one player to the roster.');
      return;
    }
    try {
      const registration = await submitBatchRegistration();
      navigate('/participant/registration-success', { state: { registrationId: registration?.id } });
    } catch {
      // Store status/error already updated for UI consumers.
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)', padding: 'var(--spacing-xl)', color: 'var(--text-primary)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <button
          onClick={() => navigate('/participant')}
          style={{ background: 'transparent', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Back to Dashboard
        </button>

        <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-lg)', color: 'var(--text-primary)' }}>Register Team</h1>

        <div className="card" style={{ marginBottom: 'var(--spacing-xl)', padding: 'var(--spacing-xl)' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Team Name</label>
          <input
            type="text"
            value={teamName}
            onChange={(event) => setTeamName(event.target.value)}
            placeholder="e.g. Chicago Bulls"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white', marginBottom: 'var(--spacing-lg)' }}
          />

          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)', color: 'var(--text-primary)' }}>Batch Roster Upload</h3>

          <form onSubmit={handleAddPlayer} style={{ display: 'flex', gap: '8px', marginBottom: 'var(--spacing-lg)' }}>
            <input type="text" placeholder="Player Name" value={newPlayer.name} onChange={(event) => setNewPlayer({ ...newPlayer, name: event.target.value })} style={{ flex: 2, padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }} />
            <input type="text" placeholder="Pos" value={newPlayer.position} onChange={(event) => setNewPlayer({ ...newPlayer, position: event.target.value })} style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }} />
            <input type="text" placeholder="No." value={newPlayer.number} onChange={(event) => setNewPlayer({ ...newPlayer, number: event.target.value })} style={{ flex: 1, padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'white' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 16px' }}>Add</button>
          </form>

          {roster.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roster.map((player) => (
                <li key={player.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: 'var(--bg-hover)', borderRadius: '8px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{player.name}</span>
                    <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: 'var(--font-size-sm)' }}>#{player.number} | {player.position}</span>
                  </div>
                  <button onClick={() => removePlayerFromRoster(player.id)} style={{ background: 'transparent', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}>Remove</button>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: 'var(--spacing-md)' }}>No players added yet.</p>
          )}
        </div>

        <button className="btn btn-primary btn-full-width btn-lg" onClick={handleSubmit} disabled={status === 'loading'} style={{ boxShadow: 'var(--shadow-neon)' }}>
          {status === 'loading' ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '3px' }}></div> Processing...
            </span>
          ) : (
            'Complete Batch Registration'
          )}
        </button>
      </div>
    </div>
  );
}
