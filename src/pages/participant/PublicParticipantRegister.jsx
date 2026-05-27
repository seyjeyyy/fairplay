import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useEventStore from '../../store/eventStore';
import useRegistrationStore from '../../store/registrationStore';
import { ensureEventTournamentAutomation } from '../../services/automationService';

const STORAGE_KEY = 'fairplay_participant_identity';

function getStoredParticipant() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
  catch { return null; }
}

function formatDate(raw) {
  if (!raw) return 'Date TBD';
  try {
    return new Date(raw).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return raw; }
}

function getSubEventName(subEvent) {
  return String(subEvent?.name || subEvent?.title || '').trim();
}

export default function PublicParticipantRegister() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('eventId');
  const { fetchEvents } = useEventStore();
  const { submitPublicRegistration } = useRegistrationStore();

  const [phase, setPhase] = useState('loading');
  const [event, setEvent] = useState(null);
  const [regType, setRegType] = useState('individual'); // individual | team
  const [selectedSubEventId, setSelectedSubEventId] = useState('');

  // Shared fields (individual name = captain name for team)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Team-only field
  const [teamName, setTeamName] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [registered, setRegistered] = useState(null);

  useEffect(() => {
    async function init() {
      if (!eventId) { setPhase('error'); return; }
      await fetchEvents();
      const ev = useEventStore.getState().events.find(
        (e) => String(e.id) === String(eventId)
      );
      if (!ev) { setPhase('error'); return; }
      setEvent(ev);
      const firstSubEvent = (ev.subEvents || []).find((subEvent) => getSubEventName(subEvent));
      if (firstSubEvent) {
        setSelectedSubEventId(String(firstSubEvent.id));
        setRegType(String(firstSubEvent.format || '').toLowerCase() === 'team' ? 'team' : 'individual');
      }

      const stored = getStoredParticipant();
      if (stored?.eventId === eventId && stored?.name) {
        if (stored.subEventId) {
          setSelectedSubEventId(String(stored.subEventId));
        }
        setRegistered(stored);
        setPhase('already');
        return;
      }
      setPhase('form');
    }
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // ── Submit ──
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const currentEvent = useEventStore.getState().getEventById(eventId);
      const existing = currentEvent?.contestants || [];
      const availableSubEvents = (currentEvent?.subEvents || []).filter((subEvent) => getSubEventName(subEvent));
      const requiresSubEvent = availableSubEvents.length > 0;
      const selectedSubEvent = requiresSubEvent
        ? availableSubEvents.find((subEvent) => String(subEvent.id) === String(selectedSubEventId))
        : null;

      if (requiresSubEvent && !selectedSubEvent) {
        setErrorMsg('Choose the sub-event you want to join.');
        setSubmitting(false);
        return;
      }

      const dupEmail = existing.some((c) => c.email?.toLowerCase() === email.toLowerCase().trim());
      if (dupEmail) { setErrorMsg('This email is already registered for this event.'); setSubmitting(false); return; }

      if (effectiveRegType === 'team' && !teamName.trim()) {
        setErrorMsg('Team name is required.');
        setSubmitting(false);
        return;
      }

      const registration = await submitPublicRegistration({
        eventId,
        registrationType: effectiveRegType,
        teamName: teamName.trim(),
        roster: [],
        individualDetails: {
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
        },
        subEventId: selectedSubEvent?.id || '',
        subEventName: getSubEventName(selectedSubEvent),
        category: getSubEventName(selectedSubEvent) || currentEvent?.eventType || '',
      });

      const refreshedEvent = useEventStore.getState().getEventById(eventId);
      const contestants = refreshedEvent?.contestants || existing;
      await ensureEventTournamentAutomation(refreshedEvent || currentEvent, contestants);

      const identity = {
        eventId,
        name: registration.participantName || registration.teamName || registration.individualDetails?.name,
        participantId: registration.participantId || registration.id,
        type: effectiveRegType,
        subEventId: registration.subEventId,
        subEventName: registration.subEventName,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
      setRegistered(identity);
      setPhase('success');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const selectableSubEvents = (event?.subEvents || []).filter((subEvent) => getSubEventName(subEvent));
  const selectedSubEvent = selectableSubEvents.find((subEvent) => String(subEvent.id) === String(selectedSubEventId));
  const selectedSubEventFormat = String(selectedSubEvent?.format || '').toLowerCase();
  const eventType = event?.eventType || event?.type || '';
  const isTournamentLike = ['tournament', 'sportsfest', 'esports', 'sports'].includes(eventType);
  const effectiveRegType = selectableSubEvents.length > 0
    ? (selectedSubEventFormat === 'team' ? 'team' : 'individual')
    : isTournamentLike
      ? 'team'
      : regType;
  const showTypeToggle = selectableSubEvents.length === 0 && !isTournamentLike;
  const showMissingSubEventsNotice = selectableSubEvents.length === 0 && isTournamentLike;
  const venueText = selectedSubEvent?.venue || event?.location || 'Venue TBD';

  /* ─── Loading ─── */
  if (phase === 'loading') {
    return (
      <div style={fullPage}>
        <i className="bi bi-arrow-repeat animate-spin" style={{ fontSize: 40, color: '#2563eb' }} />
        <p style={{ color: '#64748b', marginTop: 16 }}>Loading event...</p>
      </div>
    );
  }

  /* ─── Error ─── */
  if (phase === 'error') {
    return (
      <div style={fullPage}>
        <i className="bi bi-exclamation-triangle" style={{ fontSize: 48, color: '#ef4444', marginBottom: 16 }} />
        <div style={{ fontWeight: 800, fontSize: 20, color: '#0f172a', marginBottom: 8 }}>Event not found</div>
        <p style={{ color: '#64748b' }}>This registration link is invalid or has expired.</p>
      </div>
    );
  }

  /* ─── Already registered ─── */
  if (phase === 'already') {
    return (
      <div style={fullPage}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <i className="bi bi-patch-check-fill" style={{ fontSize: 52, color: '#2563eb', display: 'block', marginBottom: 12 }} />
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Already Registered</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>{event?.title}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe', gap: 10 }}>
            <i className="bi bi-person-check" style={{ color: '#2563eb', fontSize: 18 }} />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{registered?.name}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{registered?.type}</span>
          </div>
          {registered?.subEventName && (
            <div style={subEventPill}>
              <i className="bi bi-diagram-3" style={{ marginRight: 6 }} />
              {registered.subEventName}
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 16, lineHeight: 1.6 }}>
            You're all set! The organizer will contact you with further details.
          </p>
          <div style={datePill}>
            <i className="bi bi-calendar-event" style={{ marginRight: 6 }} />
            {formatDate(event?.startDate)} - {registered?.subEventName ? venueText : (event?.location || 'Venue TBD')}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Success ─── */
  if (phase === 'success') {
    return (
      <div style={fullPage}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <i className="bi bi-check-circle-fill" style={{ fontSize: 52, color: '#10b981', display: 'block', marginBottom: 12 }} />
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>Registration Successful!</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>{event?.title}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: 12, background: '#f0fdf4', border: '1px solid #86efac', gap: 10 }}>
            <i className="bi bi-person-check" style={{ color: '#10b981', fontSize: 18 }} />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>{registered?.name}</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: '#16a34a', textTransform: 'uppercase', fontWeight: 600 }}>{registered?.type}</span>
          </div>
          {registered?.subEventName && (
            <div style={{ ...subEventPill, background: '#ecfdf5', borderColor: '#bbf7d0', color: '#047857' }}>
              <i className="bi bi-diagram-3" style={{ marginRight: 6 }} />
              {registered.subEventName}
            </div>
          )}
          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 16, lineHeight: 1.6 }}>
            You've been registered as a contestant. The organizer will reach out with event details.
          </p>
          <div style={datePill}>
            <i className="bi bi-calendar-event" style={{ marginRight: 6 }} />
            {formatDate(event?.startDate)} - {registered?.subEventName ? venueText : (event?.location || 'Venue TBD')}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Registration form ─── */
  return (
    <div style={fullPage}>
      <div style={card}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <i className="bi bi-person-plus" style={{ fontSize: 36, color: '#2563eb', display: 'block', marginBottom: 10 }} />
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Join the Competition</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>{event?.title}</p>
        </div>

        {showTypeToggle && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24, padding: 4, borderRadius: 14, background: '#f1f5f9' }}>
            {['individual', 'team'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setRegType(t); setErrorMsg(''); }}
                style={{
                  padding: '10px',
                  borderRadius: 11,
                  border: 'none',
                  background: regType === t ? '#ffffff' : 'transparent',
                  color: regType === t ? '#2563eb' : '#64748b',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: regType === t ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <i className={t === 'individual' ? 'bi bi-person' : 'bi bi-people'} />
                {t === 'individual' ? 'Individual' : 'Team'}
              </button>
            ))}
          </div>
        )}
        {showMissingSubEventsNotice && (
          <div style={{ marginBottom: 20, padding: 14, borderRadius: 14, background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', fontSize: 13, lineHeight: 1.5 }}>
            <i className="bi bi-exclamation-circle" style={{ marginRight: 6 }} />
            No sub-events are configured for this event yet. Team registration is enabled for now.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {selectableSubEvents.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Sub-event to join <Req /></label>
              <select
                value={selectedSubEventId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  const nextSubEvent = selectableSubEvents.find((subEvent) => String(subEvent.id) === String(nextId));
                  setSelectedSubEventId(nextId);
                  setRegType(String(nextSubEvent?.format || '').toLowerCase() === 'team' ? 'team' : 'individual');
                  setErrorMsg('');
                }}
                style={inputStyle}
                disabled={submitting}
                required
              >
                {selectableSubEvents.map((subEvent) => (
                  <option key={subEvent.id} value={subEvent.id}>
                    {getSubEventName(subEvent)}{subEvent.venue ? ` - ${subEvent.venue}` : ''}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={formatBadgeStyle}>
                  <i className={effectiveRegType === 'team' ? 'bi bi-people' : 'bi bi-person'} style={{ marginRight: 6 }} />
                  {effectiveRegType === 'team' ? 'Team registration' : 'Individual registration'}
                </span>
                {selectedSubEvent?.venue && (
                  <span style={venueBadgeStyle}>
                    <i className="bi bi-geo-alt" style={{ marginRight: 6 }} />
                    {selectedSubEvent.venue}
                  </span>
                )}
              </div>
            </div>
          )}

          {effectiveRegType === 'individual' ? (
            <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Full Name <Req /></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Juan dela Cruz" style={inputStyle} disabled={submitting} required />
              </div>
              <div>
                <label style={labelStyle}>Email Address <Req /></label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan@email.com" style={inputStyle} disabled={submitting} required />
              </div>
              <div>
                <label style={labelStyle}>Phone Number <Opt /></label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XX XXX XXXX" style={inputStyle} disabled={submitting} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Team Name <Req /></label>
                <input type="text" value={teamName} onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Team Alpha" style={inputStyle} disabled={submitting} required />
              </div>
              <div style={{ padding: 14, borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'grid', gap: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Captain / Leader
                </span>
                <div>
                  <label style={labelStyle}>Full Name <Req /></label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Juan dela Cruz" style={{ ...inputStyle, background: '#fff' }} disabled={submitting} required />
                </div>
                <div>
                  <label style={labelStyle}>Email Address <Req /></label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="juan@email.com" style={{ ...inputStyle, background: '#fff' }} disabled={submitting} required />
                </div>
                <div>
                  <label style={labelStyle}>Contact Number <Opt /></label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                    placeholder="09XX XXX XXXX" style={{ ...inputStyle, background: '#fff' }} disabled={submitting} />
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, marginBottom: 16 }}>
              <i className="bi bi-exclamation-circle" style={{ marginRight: 6 }} />{errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              (selectableSubEvents.length > 0 && !selectedSubEventId) ||
              (effectiveRegType === 'individual' && (!name.trim() || !email.trim())) ||
              (effectiveRegType === 'team' && (!teamName.trim() || !name.trim() || !email.trim()))
            }
            style={{
              width: '100%', padding: '14px', borderRadius: 14, border: 'none',
              background: submitting ? '#e2e8f0' : 'linear-gradient(135deg, #2563eb, #0ea5e9)',
              color: submitting ? '#94a3b8' : '#fff',
              fontWeight: 800, fontSize: 15, cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              transition: 'all 0.2s',
              boxShadow: submitting ? 'none' : '0 8px 20px rgba(37,99,235,0.25)',
            }}
          >
            {submitting
              ? <><i className="bi bi-arrow-repeat animate-spin" /> Registering...</>
              : <><i className="bi bi-send-check" /> Register Now</>
            }
          </button>
        </form>

        <div style={datePill}>
          <i className="bi bi-calendar-event" style={{ marginRight: 6 }} />
          {formatDate(event?.startDate)} - {venueText}
        </div>
      </div>
    </div>
  );
}

function Req() {
  return <span style={{ color: '#ef4444' }}>*</span>;
}
function Opt() {
  return <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span>;
}

const fullPage = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
};

const card = {
  background: '#ffffff',
  border: '1px solid #dbeafe',
  borderRadius: 24,
  padding: 32,
  width: '100%',
  maxWidth: 440,
  boxShadow: '0 20px 60px rgba(37,99,235,0.12)',
};

const datePill = {
  marginTop: 20,
  padding: '10px 14px',
  borderRadius: 12,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  fontSize: 12,
  color: '#64748b',
  textAlign: 'center',
};

const subEventPill = {
  marginTop: 12,
  padding: '10px 14px',
  borderRadius: 12,
  background: '#eff6ff',
  border: '1px solid #bfdbfe',
  color: '#1d4ed8',
  fontSize: 13,
  fontWeight: 700,
  textAlign: 'center',
};

const formatBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '7px 10px',
  borderRadius: 999,
  background: '#eff6ff',
  border: '1px solid #bfdbfe',
  color: '#1d4ed8',
  fontSize: 12,
  fontWeight: 700,
};

const venueBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '7px 10px',
  borderRadius: 999,
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  color: '#475569',
  fontSize: 12,
  fontWeight: 700,
};

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#334155',
  marginBottom: 8,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1px solid #cbd5e1',
  fontSize: 14,
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#f8fafc',
};
