import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Trash2, UserPlus, Search, RefreshCw, X } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import useJudgeStore from '../../store/judgeStore';
import useRegistrationStore from '../../store/registrationStore';

export default function AdminUsers() {
  const { users, refreshProfiles, updateUser, deleteUser, createUser, authMode } = useAuthStore();
  const { events, fetchEvents } = useEventStore();
  const { judges, fetchJudges } = useJudgeStore();
  const { registrations, fetchRegistrations } = useRegistrationStore();
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ username: '', email: '' });
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    refreshProfiles();
    fetchEvents();
    fetchJudges();
    fetchRegistrations();
  }, [fetchEvents, fetchJudges, fetchRegistrations, refreshProfiles]);

  const enrichedUsers = useMemo(() => users.map((user) => {
    const eventCount = events.filter((event) =>
      String(event.organizer_id) === String(user.id) ||
      String(event.organizerAuthProfileId) === String(user.id) ||
      String(event.organizerEmail || '').toLowerCase() === String(user.email || '').toLowerCase()
    ).length;
    const judgeProfile = judges.find((judge) =>
      String(judge.id) === String(user.id) ||
      String(judge.authProfileId) === String(user.id) ||
      String(judge.email || '').toLowerCase() === String(user.email || '').toLowerCase()
    );
    const registrationCount = registrations.filter((registration) =>
      String(registration.email || '').toLowerCase() === String(user.email || '').toLowerCase()
    ).length;

    return {
      ...user,
      activityCount: eventCount + Number(judgeProfile?.scoreCount || 0) + registrationCount,
      eventCount,
      scoreCount: Number(judgeProfile?.scoreCount || 0),
      registrationCount,
    };
  }), [events, judges, registrations, users]);

  const filtered = enrichedUsers.filter((user) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [user.name, user.email, user.role, user.status].filter(Boolean).some((value) => String(value).toLowerCase().includes(term));
  });

  async function handleRefresh() {
    setBusy('refresh');
    await Promise.all([refreshProfiles(), fetchEvents(), fetchJudges(), fetchRegistrations()]);
    setBusy('');
  }

  function openCreateModal() {
    setCreateForm({ username: '', email: '' });
    setCreateError('');
    setShowCreateModal(true);
  }

  function closeCreateModal() {
    if (busy === 'create') return;
    setShowCreateModal(false);
    setCreateError('');
  }

  async function handleCreateUser(event) {
    event.preventDefault();
    const username = createForm.username.trim();
    const email = createForm.email.trim().toLowerCase();

    if (!username || !email) {
      setCreateError('Username and email are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCreateError('Enter a valid email address.');
      return;
    }

    if (users.some((user) => String(user.email || '').toLowerCase() === email)) {
      setCreateError('This email already exists.');
      return;
    }

    setBusy('create');
    try {
      await createUser({
        email,
        name: username,
        username,
        role: 'organizer',
        status: 'active',
        accessScope: 'organizer',
      });
      setShowCreateModal(false);
      setCreateForm({ username: '', email: '' });
      setCreateError('');
    } catch (createUserError) {
      setCreateError(createUserError?.message || 'Unable to create organizer user.');
    } finally {
      setBusy('');
    }
  }

  async function handleToggleStatus(user) {
    setBusy(`status-${user.id}`);
    await updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' });
    setBusy('');
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    setBusy(`delete-${user.id}`);
    await deleteUser(user.id);
    setBusy('');
  }

  return (
    <DashboardLayout title="User Management" subtitle={`Connected user records from ${authMode} mode`}>
      <div style={toolbarStyle}>
        <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users by name, email, role..." style={searchStyle} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleRefresh} disabled={busy === 'refresh'} style={secondaryButtonStyle}>
            <RefreshCw size={16} />
            Refresh Database
          </button>
          <button onClick={openCreateModal} disabled={Boolean(busy)} style={primaryButtonStyle}>
            <UserPlus size={16} />
            Add User
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Email', 'Role', 'Status', 'System Activity', 'Joined', 'Actions'].map((header) => (
                  <th key={header} style={thStyle}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>No user records found.</td>
                </tr>
              ) : filtered.map((user, index) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={avatarStyle}>{String(user.avatar || user.name || user.email || 'U').charAt(0).toUpperCase()}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{user.name || 'Unnamed User'}</span>
                  </td>
                  <td style={tdStyle}>{user.email || 'No email'}</td>
                  <td style={{ padding: '12px 16px' }}><span style={rolePill(user.role)}>{user.role || 'participant'}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={statusPill(user.status)}>{user.status || 'active'}</span></td>
                  <td style={tdStyle}>
                    <div>{user.eventCount} events</div>
                    <div>{user.scoreCount} scores</div>
                    <div>{user.registrationCount} registrations</div>
                  </td>
                  <td style={tdStyle}>{user.joined || 'From database'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleToggleStatus(user)} disabled={Boolean(busy)} style={iconButtonStyle} aria-label="Toggle user status">
                        <Lock size={14} />
                      </button>
                      <button onClick={() => handleDelete(user)} disabled={Boolean(busy)} style={{ ...iconButtonStyle, background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }} aria-label="Delete user">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div style={modalOverlayStyle} onMouseDown={(event) => { if (event.target === event.currentTarget) closeCreateModal(); }}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.18 }}
            style={modalCardStyle}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-organizer-title"
          >
            <div style={modalHeaderStyle}>
              <div>
                <div style={modalEyebrowStyle}>Organizer access only</div>
                <h2 id="create-organizer-title" style={modalTitleStyle}>Add Organizer User</h2>
              </div>
              <button type="button" onClick={closeCreateModal} disabled={busy === 'create'} style={modalCloseButtonStyle} aria-label="Close add organizer modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div style={modalBodyStyle}>
                <div style={roleNoticeStyle}>
                  <UserPlus size={18} />
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>Role is fixed to Organizer</div>
                    <div style={{ color: '#475569', fontSize: 13, marginTop: 2 }}>
                      This account can only access organizer pages and organizer tools.
                    </div>
                  </div>
                </div>

                <label style={fieldLabelStyle}>
                  Username
                  <input
                    value={createForm.username}
                    onChange={(event) => setCreateForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="e.g. Juan Organizer"
                    style={modalInputStyle}
                    autoFocus
                  />
                </label>

                <label style={fieldLabelStyle}>
                  Email
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="organizer@email.com"
                    style={modalInputStyle}
                  />
                </label>

                <div style={fixedRoleStyle}>
                  <span>Account role</span>
                  <strong>organizer</strong>
                </div>

                {createError && (
                  <div style={modalErrorStyle}>{createError}</div>
                )}
              </div>

              <div style={modalFooterStyle}>
                <button type="button" onClick={closeCreateModal} disabled={busy === 'create'} style={modalSecondaryButtonStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={busy === 'create'} style={{ ...primaryButtonStyle, opacity: busy === 'create' ? 0.7 : 1 }}>
                  <UserPlus size={16} />
                  {busy === 'create' ? 'Creating...' : 'Create Organizer'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
}

const cardStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' };
const toolbarStyle = { background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 16, boxShadow: '0 10px 24px rgba(15,23,42,0.06)', display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 };
const searchStyle = { padding: '10px 14px 10px 34px', borderRadius: 10, background: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', fontSize: 13, outline: 'none', width: '100%' };
const primaryButtonStyle = { padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #2563eb, #0ea5e9)', color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 10px 26px rgba(37,99,235,0.22)', display: 'inline-flex', alignItems: 'center', gap: 8 };
const secondaryButtonStyle = { padding: '10px 16px', borderRadius: 10, background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 };
const thStyle = { padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' };
const tdStyle = { padding: '12px 16px', fontSize: 13, color: '#64748b', verticalAlign: 'top' };
const avatarStyle = { width: 32, height: 32, borderRadius: 10, background: 'rgba(37,99,235,0.12)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 };
const iconButtonStyle = { width: 32, height: 32, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' };
const modalOverlayStyle = { position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(8px)', display: 'grid', placeItems: 'center', padding: 20 };
const modalCardStyle = { width: 'min(520px, 100%)', background: '#ffffff', border: '1px solid #dbeafe', borderRadius: 18, boxShadow: '0 28px 80px rgba(15,23,42,0.28)', overflow: 'hidden' };
const modalHeaderStyle = { padding: '22px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #eff6ff, #ffffff)' };
const modalEyebrowStyle = { color: '#2563eb', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 };
const modalTitleStyle = { margin: 0, color: '#0f172a', fontSize: 24, fontWeight: 900 };
const modalCloseButtonStyle = { width: 36, height: 36, borderRadius: 10, border: '1px solid #dbeafe', background: '#ffffff', color: '#0f172a', display: 'grid', placeItems: 'center', cursor: 'pointer' };
const modalBodyStyle = { padding: 24, display: 'grid', gap: 16 };
const roleNoticeStyle = { display: 'flex', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 14, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb' };
const fieldLabelStyle = { display: 'grid', gap: 8, color: '#0f172a', fontWeight: 800, fontSize: 13 };
const modalInputStyle = { width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12, border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a', outline: 'none', fontSize: 14 };
const fixedRoleStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em' };
const modalErrorStyle = { padding: '12px 14px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 700 };
const modalFooterStyle = { padding: '18px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' };
const modalSecondaryButtonStyle = { padding: '10px 16px', borderRadius: 10, background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', fontWeight: 800, fontSize: 13, cursor: 'pointer' };

function rolePill(role = 'participant') {
  const color = role === 'admin' ? '#1d4ed8' : role === 'organizer' ? '#0284c7' : role === 'judge' ? '#2563eb' : '#475569';
  return { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'rgba(37,99,235,0.10)', color };
}

function statusPill(status = 'active') {
  return { padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: status === 'active' ? 'rgba(37,99,235,0.12)' : 'rgba(239,68,68,0.12)', color: status === 'active' ? '#1d4ed8' : '#ef4444' };
}
