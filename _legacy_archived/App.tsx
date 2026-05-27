import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { aiEngine } from './utils/aiCriteriaEngine';
import { mlFeatures } from './utils/mlFeatures';
import { tournamentEngine } from './utils/tournamentEngine';

// ============================================================================
// AUTH CONTEXT & PROVIDER
// ============================================================================
const AuthContext = createContext();

const MOCK_USERS = [
  { id: 1, email: 'admin@fairplay.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: '', department: 'System Administration' },
  { id: 2, email: 'organizer@fairplay.com', password: 'org123', name: 'Organizer User', role: 'organizer', avatar: '', department: 'Event Management' },
  { id: 3, email: 'judge@fairplay.com', password: 'judge123', name: 'Judge User', role: 'judge', avatar: '', department: 'Judging Panel' },
  { id: 4, email: 'participant@fairplay.com', password: 'part123', name: 'Participant User', role: 'participant', avatar: '', department: 'Competition' },
  { id: 5, email: 'audience@fairplay.com', password: 'aud123', name: 'Audience Member', role: 'audience', avatar: '', department: 'General Public' },
];

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fairplay_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    const userData = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (userData) {
      const { password: _, ...safeUser } = userData;
      localStorage.setItem('fairplay_user', JSON.stringify(safeUser));
      setUser(safeUser);
      return { success: true, user: safeUser };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('fairplay_user');
    setUser(null);
  };

  const register = (userData) => {
    const newUser = { id: Date.now(), ...userData, avatar: '' };
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('fairplay_user', JSON.stringify(safeUser));
    setUser(safeUser);
    return { success: true, user: safeUser };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_EVENTS = [
  { id: 1, title: 'Sports Fest 2026', type: 'multi-event', status: 'active', category: 'Sports', participants: 256, maxParticipants: 500, startDate: '2026-06-01', endDate: '2026-06-15', organizer: 'Sports Committee', prizePool: '500000', venue: 'Main Sports Complex', subEvents: ['Basketball', 'Volleyball', 'Badminton', 'Chess', 'Larong Lahi', 'Esports', 'Dance Competition'] },
  { id: 2, title: 'National Coding Challenge 2026', type: 'contest', status: 'upcoming', category: 'Technology', participants: 128, maxParticipants: 200, startDate: '2026-07-10', endDate: '2026-07-12', organizer: 'Tech Corp', prizePool: '200000', venue: 'Innovation Hub' },
  { id: 3, title: 'Valorant Championship Series', type: 'esports', status: 'active', category: 'Gaming', participants: 64, maxParticipants: 64, startDate: '2026-05-20', endDate: '2026-05-25', organizer: 'Esports PH', prizePool: '300000', venue: 'Game Arena' },
  { id: 4, title: 'Inter-School Debate Cup', type: 'debate', status: 'active', category: 'Academic', participants: 32, maxParticipants: 48, startDate: '2026-06-15', endDate: '2026-06-16', organizer: 'Edu Dept', prizePool: '50000', venue: 'University Hall' },
  { id: 5, title: 'Regional Art Exhibition', type: 'contest', status: 'upcoming', category: 'Arts', participants: 45, maxParticipants: 100, startDate: '2026-08-01', endDate: '2026-08-03', organizer: 'Arts Council', prizePool: '100000', venue: 'Art Center' },
  { id: 6, title: 'Dance Competition 2026', type: 'contest', status: 'active', category: 'Arts', participants: 24, maxParticipants: 40, startDate: '2026-06-05', endDate: '2026-06-06', organizer: 'Cultural Society', prizePool: '75000', venue: 'Performing Arts Theater' },
  { id: 7, title: 'Mobile Legends Tournament', type: 'esports', status: 'active', category: 'Gaming', participants: 48, maxParticipants: 64, startDate: '2026-05-25', endDate: '2026-05-30', organizer: 'Esports PH', prizePool: '150000', venue: 'Online' },
];

const MOCK_JUDGES = [
  { id: 1, name: 'Dr. Maria Santos', specialty: 'Basketball', rating: 4.8, cases: 45, active: true, avatar: '' },
  { id: 2, name: 'Coach Juan Reyes', specialty: 'Volleyball', rating: 4.6, cases: 38, active: true, avatar: '' },
  { id: 3, name: 'GM Robert Lim', specialty: 'Chess', rating: 4.9, cases: 52, active: true, avatar: '' },
  { id: 4, name: 'Prof. Ana Cruz', specialty: 'Dance', rating: 4.7, cases: 29, active: true, avatar: '' },
  { id: 5, name: 'Mr. James Tan', specialty: 'Esports', rating: 4.5, cases: 33, active: true, avatar: '' },
  { id: 6, name: 'Ms. Lisa Garcia', specialty: 'Larong Lahi', rating: 4.4, cases: 20, active: false, avatar: '' },
  { id: 7, name: 'Dr. Carlos Mendoza', specialty: 'Badminton', rating: 4.8, cases: 41, active: true, avatar: '' },
];

const MOCK_PARTICIPANTS = [
  { id: 1, name: 'Team Alpha', event: 'Basketball', score: 92, rank: 1, matches: 5, wins: 5, avatar: '' },
  { id: 2, name: 'Team Beta', event: 'Volleyball', score: 88, rank: 2, matches: 5, wins: 4, avatar: '' },
  { id: 3, name: 'Team Gamma', event: 'Chess', score: 95, rank: 1, matches: 4, wins: 4, avatar: '' },
  { id: 4, name: 'Team Delta', event: 'Dance', score: 90, rank: 1, matches: 3, wins: 3, avatar: '' },
  { id: 5, name: 'Team Epsilon', event: 'Esports', score: 85, rank: 2, matches: 5, wins: 3, avatar: '' },
  { id: 6, name: 'Team Zeta', event: 'Badminton', score: 82, rank: 3, matches: 4, wins: 2, avatar: '' },
  { id: 7, name: 'Team Eta', event: 'Larong Lahi', score: 78, rank: 4, matches: 3, wins: 1, avatar: '' },
  { id: 8, name: 'Team Theta', event: 'Basketball', score: 87, rank: 2, matches: 5, wins: 4, avatar: '' },
  { id: 9, name: 'Team Iota', event: 'Volleyball', score: 84, rank: 3, matches: 5, wins: 3, avatar: '' },
  { id: 10, name: 'Team Kappa', event: 'Basketball', score: 79, rank: 3, matches: 5, wins: 3, avatar: '' },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Team Alpha', score: 9850, wins: 15, losses: 2, events: 17, avatar: '' },
  { rank: 2, name: 'Team Gamma', score: 9420, wins: 14, losses: 3, events: 16, avatar: '' },
  { rank: 3, name: 'Team Beta', score: 8990, wins: 12, losses: 4, events: 15, avatar: '' },
  { rank: 4, name: 'Team Delta', score: 8640, wins: 11, losses: 5, events: 14, avatar: '' },
  { rank: 5, name: 'Team Epsilon', score: 8210, wins: 10, losses: 6, events: 14, avatar: '' },
  { rank: 6, name: 'Team Theta', score: 7950, wins: 9, losses: 6, events: 13, avatar: '' },
  { rank: 7, name: 'Team Zeta', score: 7620, wins: 8, losses: 7, events: 12, avatar: '' },
  { rank: 8, name: 'Team Eta', score: 7340, wins: 7, losses: 8, events: 11, avatar: '' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, message: 'Sports Fest 2026 registration is now open', time: '2 min ago', read: false, type: 'info' },
  { id: 2, message: 'Your score has been submitted for Basketball', time: '1 hr ago', read: false, type: 'success' },
  { id: 3, message: 'Team Alpha won the Basketball Finals', time: '3 hr ago', read: true, type: 'info' },
  { id: 4, message: 'New judging criteria generated for Dance Competition', time: '5 hr ago', read: true, type: 'info' },
  { id: 5, message: 'Schedule updated for Volleyball - Round 2', time: '1 day ago', read: false, type: 'warning' },
];

const MOCK_ANALYTICS = {
  totalEvents: 7,
  activeEvents: 4,
  totalParticipants: 597,
  totalJudges: 7,
  completedEvents: 1,
  upcomingEvents: 2,
  avgParticipantsPerEvent: 85,
  totalPrizePool: '1,375,000',
  revenueGenerated: 250000,
  audienceEngagement: 78,
  averageRating: 4.6,
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

function StatCard({ icon, label, value, color = 'blue', subtitle, trend }) {
  const colors = { blue: '#4A90D9', cyan: '#5BC0DE', green: '#5CB85C', purple: '#8E7CC3', pink: '#D486B8', orange: '#F0AD4E', red: '#D9534F' };
  const bgColors = { blue: 'rgba(74,144,217,0.08)', cyan: 'rgba(91,192,222,0.08)', green: 'rgba(92,184,92,0.08)', purple: 'rgba(142,124,195,0.08)', pink: 'rgba(212,134,184,0.08)', orange: 'rgba(240,173,78,0.08)', red: 'rgba(217,83,79,0.08)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col gap-3"
      style={{ borderRadius: 'var(--radius-lg)' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: bgColors[color], color: colors[color] }}
        >
          <i className={`bi ${icon}`}></i>
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <i className={`bi bi-arrow-${trend > 0 ? 'up' : 'down'}-short`}></i>
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{value}</div>
        <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
        {subtitle && <div className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{subtitle}</div>}
      </div>
    </motion.div>
  );
}

function Card({ children, className = '', onClick, hoverable = false, style = {} }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card ${hoverable ? 'cursor-pointer hover:shadow-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', ...style }}
      whileHover={hoverable ? { y: -2 } : {}}
    >
      {children}
    </motion.div>
  );
}

function Badge({ children, variant = 'default' }) {
  const variants = {
    success: { bg: 'rgba(92,184,92,0.15)', color: '#3d8b3d' },
    warning: { bg: 'rgba(240,173,78,0.15)', color: '#c69500' },
    danger: { bg: 'rgba(217,83,79,0.15)', color: '#b52d2a' },
    info: { bg: 'rgba(91,192,222,0.15)', color: '#3a8c9e' },
    default: { bg: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)' },
    purple: { bg: 'rgba(142,124,195,0.15)', color: '#6b5b9e' },
  };
  const v = variants[variant] || variants.default;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold"
      style={{ background: v.bg, color: v.color, borderRadius: 'var(--radius-full)' }}
    >
      {children}
    </span>
  );
}

function Button({ children, variant = 'primary', size = 'md', onClick, className = '', disabled, type = 'button', icon, style = {} }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    transition: 'all 200ms ease',
    fontFamily: 'var(--font-family)',
    fontSize: size === 'sm' ? '13px' : size === 'lg' ? '16px' : '14px',
    padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '14px 28px' : '10px 20px',
    ...style,
  };

  const variants = {
    primary: { background: 'linear-gradient(135deg, #4A90D9, #5BC0DE)', color: '#fff' },
    secondary: { background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' },
    ghost: { background: 'transparent', color: 'var(--color-text-secondary)' },
    danger: { background: '#D9534F', color: '#fff' },
    success: { background: '#5CB85C', color: '#fff' },
  };

  const combinedStyle = { ...baseStyle, ...variants[variant] };

  return (
    <button type={type} style={combinedStyle} onClick={onClick} disabled={disabled} className={className}
      onMouseEnter={e => { if (!disabled && variant !== 'ghost') { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; } }}
      onMouseLeave={e => { if (!disabled) { e.target.style.transform = 'none'; e.target.style.boxShadow = 'none'; } }}>
      {icon && <i className={`bi ${icon}`}></i>}
      {children}
    </button>
  );
}

function Input({ label, type = 'text', placeholder, value, onChange, name, error, icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>}
      <div className="relative">
        {icon && <i className={`bi ${icon} absolute left-3 top-1/2 -translate-y-1/2`} style={{ color: 'var(--color-text-muted)' }}></i>}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full"
          style={{
            padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            background: 'var(--color-bg-secondary)',
            border: error ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 200ms ease',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--color-accent-blue)'; }}
          onBlur={e => { e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--color-border)'; }}
        />
      </div>
      {error && <span className="text-xs" style={{ color: 'var(--color-danger)' }}>{error}</span>}
    </div>
  );
}

function Select({ label, name, value, onChange, options, placeholder = 'Select...', icon }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>{label}</label>}
      <div className="relative">
        {icon && <i className={`bi ${icon} absolute left-3 top-1/2 -translate-y-1/2`} style={{ color: 'var(--color-text-muted)' }}></i>}
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={{
            width: '100%',
            padding: icon ? '10px 12px 10px 36px' : '10px 12px',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: '14px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="">{placeholder}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const sizes = { sm: '400px', md: '520px', lg: '700px', xl: '900px' };
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
          zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="glass-card"
          style={{
            width: '100%', maxWidth: sizes[size], maxHeight: '85vh', overflow: 'auto',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '24px', padding: '4px' }}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Table({ columns, data, onRowClick, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span style={{ color: 'var(--color-text-muted)' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center py-12" style={{ color: 'var(--color-text-muted)' }}>
        <i className="bi bi-inbox text-4xl mb-3"></i>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto" style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-bg-secondary)' }}>
            {columns.map((col, i) => (
              <th key={i} className="text-left p-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              style={{
                borderBottom: '1px solid var(--color-border-light)',
                cursor: onRowClick ? 'pointer' : 'default',
                transition: 'background 150ms ease',
              }}
              className="hover:bg-gray-50"
            >
              {columns.map((col, j) => (
                <td key={j} className="p-3 text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex gap-1 p-1" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: '10px 20px',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            background: activeTab === tab.id ? 'var(--color-bg-primary)' : 'transparent',
            color: activeTab === tab.id ? 'var(--color-accent-blue)' : 'var(--color-text-secondary)',
            fontWeight: activeTab === tab.id ? 600 : 400,
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
          }}
        >
          {tab.icon && <i className={`bi ${tab.icon} me-2`}></i>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// LAYOUT COMPONENTS
// ============================================================================

function Navbar({ onToggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
      background: 'var(--color-bg-primary)',
      borderBottom: '1px solid var(--color-border-light)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', zIndex: 100,
      backdropFilter: 'blur(10px)',
    }}>
      <div className="flex items-center gap-4">
        {user && (
          <button onClick={onToggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '20px', padding: '4px' }}>
            <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
          </button>
        )}
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '18px',
          }}>F</div>
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #212529, #4A90D9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAIRPLAY</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '18px', padding: '8px' }}>
          <i className="bi bi-search"></i>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontSize: '20px', padding: '8px', position: 'relative' }}
          >
            <i className="bi bi-bell"></i>
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '18px', height: '18px', borderRadius: '50%',
                background: '#D9534F', color: '#fff',
                fontSize: '10px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{
                position: 'absolute', top: '100%', right: 0, width: '360px',
                marginTop: '8px', padding: 0, overflow: 'hidden',
                zIndex: 1000, boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="p-4 border-b" style={{ borderColor: 'var(--color-border-light)' }}>
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              {MOCK_NOTIFICATIONS.map(n => (
                <div key={n.id} className="p-4 border-b flex gap-3" style={{ borderColor: 'var(--color-border-light)', background: n.read ? 'transparent' : 'rgba(74,144,217,0.04)' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                    background: n.type === 'success' ? 'rgba(92,184,92,0.15)' : n.type === 'warning' ? 'rgba(240,173,78,0.15)' : 'rgba(74,144,217,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: n.type === 'success' ? '#3d8b3d' : n.type === 'warning' ? '#c69500' : '#4A90D9',
                    flexShrink: 0,
                  }}>
                    <i className={`bi ${n.type === 'success' ? 'bi-check-circle' : n.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'}`}></i>
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{n.message}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', borderRadius: 'var(--radius-md)' }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '14px', fontWeight: 700,
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium hidden md:block" style={{ color: 'var(--color-text-primary)' }}>{user?.name?.split(' ')[0]}</span>
            <i className="bi bi-chevron-down text-xs" style={{ color: 'var(--color-text-muted)' }}></i>
          </button>

          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card"
              style={{
                position: 'absolute', top: '100%', right: 0, width: '260px',
                marginTop: '8px', padding: 'var(--space-4)', zIndex: 1000,
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <div className="flex items-center gap-3 mb-4 p-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '16px', fontWeight: 700,
                }}>{user?.name?.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{user?.role}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => { setShowProfile(false); }} className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-50" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-person me-2"></i> Profile
                </button>
                <button onClick={() => { setShowProfile(false); }} className="w-full text-left p-2 text-sm rounded-md hover:bg-gray-50" style={{ color: 'var(--color-text-secondary)' }}>
                  <i className="bi bi-gear me-2"></i> Settings
                </button>
                <hr style={{ borderColor: 'var(--color-border-light)', margin: '4px 0' }} />
                <button onClick={() => { logout(); navigate('/'); setShowProfile(false); }} className="w-full text-left p-2 text-sm rounded-md hover:bg-red-50" style={{ color: '#D9534F' }}>
                  <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up', path: '/analytics' },
      { id: 'events', label: 'Events', icon: 'bi-calendar-event', path: '/events' },
      { id: 'users', label: 'Users', icon: 'bi-people', path: '/users' },
      { id: 'judges', label: 'Judges', icon: 'bi-person-badge', path: '/judges' },
      { id: 'reports', label: 'Reports', icon: 'bi-file-earmark-bar-graph', path: '/reports' },
      { id: 'settings', label: 'Settings', icon: 'bi-gear', path: '/settings' },
      { id: 'ai-monitor', label: 'AI Monitor', icon: 'bi-cpu', path: '/ai-monitor' },
    ],
    organizer: [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { id: 'create-event', label: 'Create Event', icon: 'bi-plus-circle', path: '/create-event' },
      { id: 'events', label: 'My Events', icon: 'bi-calendar-event', path: '/events' },
      { id: 'teams', label: 'Teams', icon: 'bi-people', path: '/teams' },
      { id: 'participants', label: 'Participants', icon: 'bi-person-lines-fill', path: '/participants' },
      { id: 'judges', label: 'Judges', icon: 'bi-person-badge', path: '/judges' },
      { id: 'brackets', label: 'Brackets', icon: 'bi-diagram-3', path: '/brackets' },
      { id: 'scoring', label: 'Live Scoring', icon: 'bi-trophy', path: '/scoring' },
      { id: 'schedule', label: 'Schedule', icon: 'bi-clock', path: '/schedule' },
      { id: 'qr-scanner', label: 'QR Attendance', icon: 'bi-qr-code-scan', path: '/qr-scanner' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'bi-bar-chart-line', path: '/leaderboard' },
    ],
    judge: [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { id: 'scoring', label: 'Score Event', icon: 'bi-pencil-square', path: '/judge-scoring' },
      { id: 'events', label: 'Assigned Events', icon: 'bi-calendar-check', path: '/judge-events' },
      { id: 'history', label: 'Scoring History', icon: 'bi-clock-history', path: '/judge-history' },
      { id: 'analytics', label: 'My Analytics', icon: 'bi-graph-up', path: '/judge-analytics' },
    ],
    participant: [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { id: 'events', label: 'My Events', icon: 'bi-calendar-event', path: '/participant-events' },
      { id: 'scores', label: 'My Scores', icon: 'bi-bar-chart', path: '/participant-scores' },
      { id: 'schedule', label: 'Schedule', icon: 'bi-clock', path: '/participant-schedule' },
      { id: 'team', label: 'My Team', icon: 'bi-people', path: '/participant-team' },
    ],
    audience: [
      { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', path: '/dashboard' },
      { id: 'events', label: 'Live Events', icon: 'bi-broadcast', path: '/audience-events' },
      { id: 'vote', label: 'Vote Now', icon: 'bi-hand-thumbs-up', path: '/audience-vote' },
      { id: 'leaderboard', label: 'Leaderboard', icon: 'bi-trophy', path: '/leaderboard' },
    ],
  };

  const items = menuItems[user?.role] || menuItems.participant;

  const isActive = (path) => location.pathname === path;

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 0 }}
      style={{
        position: 'fixed', left: 0, top: '70px', bottom: 0,
        background: 'var(--color-bg-primary)',
        borderRight: '1px solid var(--color-border-light)',
        overflow: 'hidden', zIndex: 99,
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: '16px 12px', minWidth: '260px' }}>
        <div className="mb-4 p-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Role</p>
          <p className="text-sm font-semibold capitalize" style={{ color: 'var(--color-text-primary)' }}>{user?.role}</p>
        </div>

        <nav className="flex flex-col gap-0.5">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => { navigate(item.path); onClose?.(); }}
              className="flex items-center gap-3 w-full text-left"
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                cursor: 'pointer',
                background: isActive(item.path) ? 'rgba(74,144,217,0.08)' : 'transparent',
                color: isActive(item.path) ? '#4A90D9' : 'var(--color-text-secondary)',
                fontSize: '14px',
                fontWeight: isActive(item.path) ? 600 : 400,
                transition: 'all 150ms ease',
              }}
              onMouseEnter={e => { if (!isActive(item.path)) e.target.style.background = 'var(--color-bg-secondary)'; e.target.style.color = 'var(--color-text-primary)'; }}
              onMouseLeave={e => { if (!isActive(item.path)) { e.target.style.background = 'transparent'; e.target.style.color = 'var(--color-text-secondary)'; }}}
            >
              <i className={`bi ${item.icon} text-lg`} style={{ width: '20px' }}></i>
              <span>{item.label}</span>
              {isActive(item.path) && (
                <motion.div layoutId="activeIndicator" style={{
                  marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%',
                  background: '#4A90D9',
                }} />
              )}
            </button>
          ))}
        </nav>
      </div>
    </motion.aside>
  );
}

// ============================================================================
// LANDING PAGE
// ============================================================================

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user]);

  return (
    <div>
      {/* Top Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-border-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', zIndex: 100,
      }}>
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '18px',
          }}>F</div>
          <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>FAIRPLAY</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)', fontWeight: 500, fontSize: '14px' }}>
            Sign In
          </button>
          <button onClick={() => setShowRegister(true)} style={{
            background: 'linear-gradient(135deg, #4A90D9, #5BC0DE)', color: '#fff',
            border: 'none', cursor: 'pointer', padding: '10px 24px',
            borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '14px',
          }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', padding: '120px 32px 80px', maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <Badge variant="info" className="mb-4">
              <i className="bi bi-stars"></i> AI-Powered Event Management
            </Badge>
            <h1 className="text-5xl font-extrabold mb-4" style={{ color: 'var(--color-text-primary)', lineHeight: 1.1 }}>
              Intelligent Event<br />
              <span className="text-gradient">Management Platform</span>
            </h1>
            <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              Manage tournaments, contests, and competitions with AI-powered judging, 
              real-time scoring, automatic bracket generation, and audience engagement tracking.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowRegister(true)} style={{
                background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)', color: '#fff',
                border: 'none', cursor: 'pointer', padding: '14px 32px',
                borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '15px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                Start Free <i className="bi bi-arrow-right"></i>
              </button>
              <button onClick={() => setShowLogin(true)} style={{
                background: 'var(--color-bg-secondary)', color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)', cursor: 'pointer',
                padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 500, fontSize: '15px',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <i className="bi bi-play-circle"></i> Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-8 pt-8" style={{ borderTop: '1px solid var(--color-border-light)' }}>
              <div><span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>10K+</span><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Events Created</p></div>
              <div><span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>50K+</span><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Participants</p></div>
              <div><span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>99.9%</span><p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Uptime Rate</p></div>
            </div>
          </div>
          <div className="flex-1">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <div style={{
                width: 400, height: 400,
                background: 'radial-gradient(circle at 30% 30%, rgba(74,144,217,0.2), rgba(142,124,195,0.2))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 280, height: 280, borderRadius: 'var(--radius-2xl)',
                  background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(74,144,217,0.3)',
                }}>
                  <i className="bi bi-trophy text-8xl" style={{ color: '#fff' }}></i>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 32px', background: 'var(--color-bg-secondary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Powerful Features</h2>
            <p style={{ color: 'var(--color-text-secondary)' }}>Everything you need to manage professional events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'bi-cpu', title: 'AI Criteria Generation', desc: 'Automatically generate judging criteria based on event type, category, and difficulty level.' },
              { icon: 'bi-graph-up-arrow', title: 'ML Predictions', desc: 'Winner prediction, performance analytics, and judge bias detection powered by ML.' },
              { icon: 'bi-diagram-3', title: 'Tournament Brackets', desc: 'Single/Double elimination, Round Robin, Swiss format, and group stages.' },
              { icon: 'bi-people', title: 'Smart Judging Panel', desc: 'Real-time scoring, automatic averaging, anti-cheating system, and transparency.' },
              { icon: 'bi-hand-thumbs-up', title: 'Audience Impact', desc: 'Live voting, reactions, predictions, polls, and engagement analysis.' },
              { icon: 'bi-qr-code-scan', title: 'QR Attendance', desc: 'Scan QR codes for attendance tracking and participant verification.' },
            ].map((feature, i) => (
              <Card key={i} hoverable>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'rgba(74,144,217,0.1)', color: '#4A90D9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', marginBottom: '16px',
                }}>
                  <i className={`bi ${feature.icon}`}></i>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Ready to Transform Your Events?</h2>
          <p className="mb-8" style={{ color: 'var(--color-text-secondary)' }}>Start managing your events with AI-powered intelligence today.</p>
          <button onClick={() => setShowRegister(true)} style={{
            background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)', color: '#fff',
            border: 'none', cursor: 'pointer', padding: '16px 36px',
            borderRadius: 'var(--radius-md)', fontWeight: 600, fontSize: '16px',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}>
            Start Free Today <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="flex items-center gap-2">
            <div style={{
              width: 24, height: 24, borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #4A90D9, #8E7CC3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '12px',
            }}>F</div>
            <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>FAIRPLAY</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>2026 FAIRPLAY. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitch={() => { setShowLogin(false); setShowRegister(true); }} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} onSwitch={() => { setShowRegister(false); setShowLogin(true); }} />
    </div>
  );
}

function LoginModal({ isOpen, onClose, onSwitch }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (result.success) { onClose(); navigate('/dashboard'); }
    else setError(result.error);
    setLoading(false);
  };

  const quickLogin = (role) => {
    const userMap = { admin: 'admin@fairplay.com', organizer: 'organizer@fairplay.com', judge: 'judge@fairplay.com', participant: 'participant@fairplay.com', audience: 'audience@fairplay.com' };
    setEmail(userMap[role] || '');
    setPassword(role === 'audience' ? 'aud123' : `${role === 'admin' ? 'admin' : role === 'organizer' ? 'org' : role}123`);
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>Quick Demo Access</p>
          <div className="grid grid-cols-2 gap-2">
            {['admin', 'organizer', 'judge', 'participant', 'audience'].map(role => (
              <button key={role} type="button" onClick={() => quickLogin(role)}
                style={{
                  padding: '8px', borderRadius: 'var(--radius-sm)', border: email.includes(role) ? '1px solid #4A90D9' : '1px solid var(--color-border)',
                  background: email.includes(role) ? 'rgba(74,144,217,0.08)' : 'var(--color-bg-secondary)',
                  color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >{role === 'organizer' ? 'Organizer' : role === 'audience' ? 'Audience' : role}</button>
            ))}
          </div>
        </div>
        <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} icon="bi-envelope" />
        <Input label="Password" type="password" placeholder="Enter password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} icon="bi-lock" />
        {error && <p className="text-sm" style={{ color: 'var(--color-danger)' }}><i className="bi bi-exclamation-circle me-1"></i>{error}</p>}
        <Button type="submit" variant="primary" size="lg" disabled={loading} icon="bi-box-arrow-in-right" className="w-full justify-center">
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#4A90D9', cursor: 'pointer', fontWeight: 600 }}>Sign up</button>
        </p>
      </form>
    </Modal>
  );
}

function RegisterModal({ isOpen, onClose, onSwitch }) {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name required';
    if (!form.email) newErrors.email = 'Email required';
    if (!form.password || form.password.length < 6) newErrors.password = 'Password must be 6+ characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.role) newErrors.role = 'Select a role';

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    register({ ...form, avatar: '' });
    onClose();
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account" size="sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Full Name" placeholder="John Doe" name="name" value={form.name} onChange={handleChange} error={errors.name} icon="bi-person" />
        <Input label="Email" type="email" placeholder="you@example.com" name="email" value={form.email} onChange={handleChange} error={errors.email} icon="bi-envelope" />
        <Input label="Password" type="password" placeholder="Create password" name="password" value={form.password} onChange={handleChange} error={errors.password} icon="bi-lock" />
        <Input label="Confirm Password" type="password" placeholder="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} icon="bi-shield-lock" />
        <Select label="Role" name="role" value={form.role} onChange={handleChange}
          options={[
            { value: 'organizer', label: 'Event Organizer' },
            { value: 'judge', label: 'Judge' },
            { value: 'participant', label: 'Participant' },
            { value: 'audience', label: 'Audience' },
          ]}
          icon="bi-person-badge"
        />
        {errors.role && <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{errors.role}</p>}
        <Button type="submit" variant="primary" size="lg" disabled={loading} icon="bi-person-plus">
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
        <p className="text-sm text-center" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <button type="button" onClick={onSwitch} style={{ background: 'none', border: 'none', color: '#4A90D9', cursor: 'pointer', fontWeight: 600 }}>Sign in</button>
        </p>
      </form>
    </Modal>
  );
}

// ============================================================================
// DASHBOARD PAGES
// ============================================================================

function Dashboard() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin': return <AdminDashboard />;
      case 'organizer': return <OrganizerDashboard />;
      case 'judge': return <JudgeDashboard />;
      case 'audience': return <AudienceDashboard />;
      default: return <ParticipantDashboard />;
    }
  };

  return (
    <div>
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          marginLeft: sidebarOpen ? '260px' : '0',
          marginTop: '70px',
          padding: '32px',
          minHeight: 'calc(100vh - 70px)',
          background: 'var(--color-bg-secondary)',
          transition: 'margin-left 300ms ease',
        }}
      >
        {renderDashboard()}
      </motion.main>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>System overview and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon="bi-download">Export Report</Button>
          <Button variant="primary" icon="bi-plus-circle">New Event</Button>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
          { id: 'events', label: 'Events', icon: 'bi-calendar-event' },
          { id: 'users', label: 'Users', icon: 'bi-people' },
          { id: 'analytics', label: 'Analytics', icon: 'bi-graph-up' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="mt-6">
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard icon="bi-calendar-check" label="Total Events" value={MOCK_ANALYTICS.totalEvents} color="blue" />
              <StatCard icon="bi-people" label="Total Participants" value={MOCK_ANALYTICS.totalParticipants.toLocaleString()} color="purple" />
              <StatCard icon="bi-person-badge" label="Active Judges" value={MOCK_ANALYTICS.totalJudges} color="green" />
              <StatCard icon="bi-cash-stack" label="Prize Pool" value={`₱${MOCK_ANALYTICS.totalPrizePool}`} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Active Events</h3>
                <Table
                  columns={[
                    { header: 'Event', accessor: 'title', render: (r) => <span className="font-medium">{r.title}</span> },
                    { header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : r.status === 'upcoming' ? 'warning' : 'default'}>{r.status}</Badge> },
                    { header: 'Participants', accessor: 'participants' },
                    { header: 'Category', accessor: 'category' },
                  ]}
                  data={MOCK_EVENTS.slice(0, 4)}
                />
              </Card>

              <Card>
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Stats</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Active Events', value: MOCK_ANALYTICS.activeEvents, max: MOCK_ANALYTICS.totalEvents, color: '#4A90D9' },
                    { label: 'Audience Engagement', value: MOCK_ANALYTICS.audienceEngagement, max: 100, color: '#8E7CC3' },
                    { label: 'Average Rating', value: MOCK_ANALYTICS.averageRating * 20, max: 100, color: '#5BC0DE' },
                  ].map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: 'var(--color-text-secondary)' }}>{stat.label}</span>
                        <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{stat.label === 'Average Rating' ? MOCK_ANALYTICS.averageRating : stat.value}</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                          style={{ height: '100%', background: stat.color, borderRadius: 'var(--radius-full)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="mt-6">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Overall Leaderboard</h3>
              <Table
                columns={[
                  { header: 'Rank', render: (r) => <span className="font-bold" style={{ color: r.rank <= 3 ? '#4A90D9' : 'var(--color-text-secondary)' }}>#{r.rank}</span> },
                  { header: 'Team', accessor: 'name', render: (r) => <span className="font-medium">{r.name}</span> },
                  { header: 'Score', accessor: 'score' },
                  { header: 'Wins', accessor: 'wins' },
                  { header: 'Events', accessor: 'events' },
                ]}
                data={MOCK_LEADERBOARD}
              />
            </Card>
          </>
        )}

        {activeTab === 'events' && (
          <Card>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>All Events</h3>
            <Table
              columns={[
                { header: 'Title', accessor: 'title', render: (r) => <span className="font-medium">{r.title}</span> },
                { header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : r.status === 'upcoming' ? 'warning' : 'default'}>{r.status}</Badge> },
                { header: 'Category', accessor: 'category' },
                { header: 'Participants', render: (r) => `${r.participants}/${r.maxParticipants}` },
                { header: 'Start Date', accessor: 'startDate' },
                { header: 'Actions', render: () => <button style={{ background: 'none', border: 'none', color: '#4A90D9', cursor: 'pointer' }}><i className="bi bi-three-dots-vertical"></i></button> },
              ]}
              data={MOCK_EVENTS}
            />
          </Card>
        )}

        {activeTab === 'users' && (
          <Card>
            <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>System Users</h3>
            <Table
              columns={[
                { header: 'Name', accessor: 'name', render: (r) => <span className="font-medium">{r.name}</span> },
                { header: 'Email', accessor: 'email' },
                { header: 'Role', render: (r) => <Badge variant={r.role === 'admin' ? 'danger' : r.role === 'organizer' ? 'info' : r.role === 'judge' ? 'purple' : 'default'}>{r.role}</Badge> },
                { header: 'Department', accessor: 'department' },
              ]}
              data={MOCK_USERS}
            />
          </Card>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Revenue Analytics</h3>
              <p className="text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>₱250,000</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Generated this period</p>
            </Card>
            <Card>
              <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Engagement Rate</h3>
              <p className="text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>78%</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Average audience engagement</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

// Organizer Dashboard
function OrganizerDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCriteriaModal, setShowCriteriaModal] = useState(false);
  const [generatedCriteria, setGeneratedCriteria] = useState(null);

  const handleGenerateCriteria = () => {
    const params = {
      eventType: 'sports',
      category: 'basketball',
      difficulty: 'intermediate',
      numberOfJudges: 5,
      scoringMethodology: 'point-based',
    };
    const result = aiEngine.generateCriteria(params);
    setGeneratedCriteria(result);
    setShowCriteriaModal(true);
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Organizer Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage your events and tournaments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon="bi-cpu" onClick={handleGenerateCriteria}>AI Criteria</Button>
          <Button variant="primary" icon="bi-plus-circle" onClick={() => setShowCreateModal(true)}>Create Event</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="bi-calendar-check" label="Active Events" value={MOCK_ANALYTICS.activeEvents} color="blue" />
        <StatCard icon="bi-people" label="Participants" value={MOCK_ANALYTICS.totalParticipants} color="purple" />
        <StatCard icon="bi-person-badge" label="Judges Assigned" value={MOCK_ANALYTICS.totalJudges} color="green" />
        <StatCard icon="bi-cash-stack" label="Prize Pool" value={`₱${MOCK_ANALYTICS.totalPrizePool}`} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>My Events</h3>
          <Table
            columns={[
              { header: 'Event', accessor: 'title', render: (r) => <span className="font-medium">{r.title}</span> },
              { header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : r.status === 'upcoming' ? 'warning' : 'default'}>{r.status}</Badge> },
              { header: 'Participants', render: (r) => `${r.participants}/${r.maxParticipants}` },
              { header: 'Category', accessor: 'category' },
            ]}
            data={MOCK_EVENTS}
          />
        </Card>

        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Upcoming Schedule</h3>
          <div className="space-y-3">
            {MOCK_EVENTS.filter(e => e.status === 'upcoming' || e.status === 'active').slice(0, 4).map(event => (
              <div key={event.id} className="p-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{event.title}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  <i className="bi bi-calendar2 me-1"></i> {event.startDate} - {event.endDate}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <i className="bi bi-geo-alt me-1"></i> {event.venue}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Judges Panel</h3>
          <Table
            columns={[
              { header: 'Name', accessor: 'name', render: (r) => <span className="font-medium">{r.name}</span> },
              { header: 'Specialty', accessor: 'specialty' },
              { header: 'Rating', render: (r) => <div className="flex items-center gap-1"><i className="bi bi-star-fill text-yellow-400"></i> {r.rating}</div> },
              { header: 'Status', render: (r) => <Badge variant={r.active ? 'success' : 'danger'}>{r.active ? 'Active' : 'Inactive'}</Badge> },
            ]}
            data={MOCK_JUDGES}
          />
        </Card>

        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>ML Predictions</h3>
          <div className="space-y-3">
            {[
              { event: 'Basketball Finals', team: 'Team Alpha', probability: 82 },
              { event: 'Chess Championship', team: 'Team Gamma', probability: 91 },
              { event: 'Volleyball Finals', team: 'Team Beta', probability: 76 },
            ].map((pred, i) => (
              <div key={i} className="p-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{pred.event}</span>
                  <Badge variant="info">{pred.probability}%</Badge>
                </div>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Predicted winner: {pred.team}</p>
                <div style={{ height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: 8 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pred.probability}%` }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #4A90D9, #8E7CC3)', borderRadius: 'var(--radius-full)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      {/* AI Criteria Modal */}
      <Modal isOpen={showCriteriaModal} onClose={() => setShowCriteriaModal(false)} title="AI Generated Criteria" size="lg">
        {generatedCriteria && (
          <div className="space-y-6">
            <div className="p-4" style={{ background: 'rgba(74,144,217,0.08)', borderRadius: 'var(--radius-md)' }}>
              <h4 className="font-semibold mb-2" style={{ color: '#4A90D9' }}>Criteria Overview</h4>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Weight: {generatedCriteria.totalWeight}% | Difficulty: {generatedCriteria.difficulty}x | Recommended Judges: {generatedCriteria.recommendedJudges}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Criteria Breakdown</h4>
              {generatedCriteria.criteria.map((c, i) => (
                <div key={i} className="p-4 mb-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{c.name}</span>
                    <Badge variant="info">{c.weight}%</Badge>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.description}</p>
                  <div style={{ height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', marginTop: 8 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${c.weight}%` }}
                      style={{ height: '100%', background: '#4A90D9', borderRadius: 'var(--radius-full)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Deduction Rules</h4>
              <div className="space-y-2">
                {generatedCriteria.deductions.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <i className="bi bi-dash-circle text-red-400"></i> {d}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Rubric Levels</h4>
              {generatedCriteria.rubrics.slice(0, 2).map((rubric, i) => (
                <div key={i} className="p-3 mb-2" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>{rubric.criteriaName}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {rubric.levels.map((level, j) => (
                      <div key={j} className="p-2 text-center text-xs" style={{ background: level.score >= 4 ? 'rgba(92,184,92,0.15)' : level.score >= 3 ? 'rgba(240,173,78,0.15)' : 'rgba(217,83,79,0.15)', borderRadius: 'var(--radius-sm)' }}>
                        <span className="font-bold" style={{ color: level.score >= 4 ? '#3d8b3d' : level.score >= 3 ? '#c69500' : '#b52d2a' }}>{level.score}</span>
                        <p style={{ color: 'var(--color-text-muted)' }}>{level.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Button variant="primary" icon="bi-check2" onClick={() => setShowCriteriaModal(false)} className="w-full justify-center">
              Apply Criteria
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function CreateEventModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', type: '', category: '', description: '', maxParticipants: '',
    startDate: '', endDate: '', venue: '', format: '', prizePool: '',
    subEvents: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = () => { onClose(); setStep(1); };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Event" size="xl">
      {/* Step Indicator */}
      <div className="flex gap-2 mb-8">
        {['Basic Info', 'Schedule', 'Details', 'Review'].map((title, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: i < step ? '#4A90D9' : i === step - 1 ? '#5BC0DE' : 'var(--color-bg-secondary)',
              border: `2px solid ${i <= step - 1 ? '#4A90D9' : 'var(--color-border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '12px',
              color: i <= step - 1 ? '#fff' : 'var(--color-text-muted)',
            }}>
              {i < step - 1 ? <i className="bi bi-check"></i> : i + 1}
            </div>
            <span className="text-xs font-medium" style={{ color: i <= step - 1 ? '#4A90D9' : 'var(--color-text-muted)' }}>{title}</span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Input label="Event Title" placeholder="e.g., Sports Fest 2026" name="title" value={form.title} onChange={handleChange} />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Event Type" name="type" value={form.type} onChange={handleChange}
              options={[
                { value: 'multi-event', label: 'Multi-Event Festival' },
                { value: 'contest', label: 'Contest' },
                { value: 'tournament', label: 'Tournament' },
                { value: 'esports', label: 'Esports' },
                { value: 'debate', label: 'Debate' },
              ]}
            />
            <Select label="Category" name="category" value={form.category} onChange={handleChange}
              options={[
                { value: 'Sports', label: 'Sports' },
                { value: 'Technology', label: 'Technology' },
                { value: 'Gaming', label: 'Gaming' },
                { value: 'Academic', label: 'Academic' },
                { value: 'Arts', label: 'Arts' },
              ]}
            />
          </div>
          <Input label="Description" placeholder="Describe your event..." name="description" value={form.description} onChange={handleChange} />
          <Input label="Max Participants" type="number" placeholder="500" name="maxParticipants" value={form.maxParticipants} onChange={handleChange} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
          </div>
          <Input label="Venue" placeholder="e.g., Main Sports Complex" name="venue" value={form.venue} onChange={handleChange} />
          <Select label="Format" name="format" value={form.format} onChange={handleChange}
            options={[
              { value: 'In-person', label: 'In-person' },
              { value: 'Online', label: 'Online' },
              { value: 'Hybrid', label: 'Hybrid' },
            ]}
          />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Input label="Prize Pool (PHP)" type="number" placeholder="100000" name="prizePool" value={form.prizePool} onChange={handleChange} icon="bi-cash" />
          <div className="p-4" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <h4 className="font-medium mb-3" style={{ color: 'var(--color-text-primary)' }}>AI Criteria Settings</h4>
            <Select label="Difficulty Level" name="difficulty"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
                { value: 'professional', label: 'Professional' },
              ]}
            />
            <div className="mt-3">
              <Select label="Scoring Methodology"
                options={[
                  { value: 'point-based', label: 'Point Based (1-5 scale)' },
                  { value: 'percentage', label: 'Percentage Based' },
                  { value: 'ranked', label: 'Ranked System' },
                  { value: 'cumulative', label: 'Cumulative Scoring' },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div className="p-4" style={{ background: 'rgba(74,144,217,0.08)', borderRadius: 'var(--radius-md)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Event Summary</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Title:</span> {form.title || 'Not set'}</p>
              <p><span className="font-medium">Type:</span> {form.type || 'Not set'}</p>
              <p><span className="font-medium">Category:</span> {form.category || 'Not set'}</p>
              <p><span className="font-medium">Dates:</span> {form.startDate || 'Not set'} - {form.endDate || 'Not set'}</p>
              <p><span className="font-medium">Venue:</span> {form.venue || 'Not set'}</p>
              <p><span className="font-medium">Prize Pool:</span> {form.prizePool ? `₱${parseInt(form.prizePool).toLocaleString()}` : 'Not set'}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="secondary" icon="bi-arrow-left" onClick={() => step > 1 ? setStep(step - 1) : onClose()}>
          {step > 1 ? 'Back' : 'Cancel'}
        </Button>
        {step < 4 ? (
          <Button variant="primary" icon="bi-arrow-right" onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button variant="success" icon="bi-check2" onClick={handleSubmit}>Create Event</Button>
        )}
      </div>
    </Modal>
  );
}

// Judge Dashboard
function JudgeDashboard() {
  const [scoringEvent, setScoringEvent] = useState(null);
  const [scores, setScores] = useState({});

  const handleScoreChange = (participantId, score) => {
    setScores({ ...scores, [participantId]: score });
  };

  const handleSubmitScores = () => {
    // Mock submission
    alert('Scores submitted successfully!');
    setScoringEvent(null);
    setScores({});
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Judge Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Score and evaluate participants</p>
        </div>
        <Button variant="primary" icon="bi-pencil-square">Score Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="bi-calendar-check" label="Upcoming Events" value={3} color="blue" />
        <StatCard icon="bi-pencil-square" label="Pending Scores" value={5} color="orange" />
        <StatCard icon="bi-check2-circle" label="Completed" value={12} color="green" />
        <StatCard icon="bi-star" label="Avg Score Given" value="4.2" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Assigned Events</h3>
          <Table
            columns={[
              { header: 'Event', accessor: 'title', render: (r) => <span className="font-medium">{r.title}</span> },
              { header: 'Type', accessor: 'type' },
              { header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge> },
              { header: 'Action', render: (r) => <button onClick={() => setScoringEvent(r)} style={{ background: 'none', border: 'none', color: '#4A90D9', cursor: 'pointer', fontSize: '13px' }}>Score <i className="bi bi-box-arrow-up-right ms-1"></i></button> },
            ]}
            data={MOCK_EVENTS.slice(0, 4)}
          />
        </Card>

        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Quick Scores</h3>
          <div className="space-y-3">
            {MOCK_PARTICIPANTS.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-2" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{p.name}</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min="0" max="100" placeholder="Score"
                    value={scores[p.id] || ''}
                    onChange={(e) => handleScoreChange(p.id, e.target.value)}
                    style={{ width: 80, padding: '4px 8px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', textAlign: 'center' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {scoringEvent && (
        <ScoringModal event={scoringEvent} onClose={() => setScoringEvent(null)} onSubmit={handleSubmitScores} scores={scores} onScoreChange={handleScoreChange} />
      )}
    </div>
  );
}

function ScoringModal({ event, onClose, onSubmit, scores, onScoreChange }) {
  return (
    <Modal isOpen={true} onClose={onClose} title={`Scoring: ${event.title}`} size="lg">
      <div className="space-y-6">
        <div className="p-4" style={{ background: 'rgba(74,144,217,0.08)', borderRadius: 'var(--radius-md)' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#4A90D9' }}>AI Generated Criteria</h4>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Weighted criteria based on event type and difficulty</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Scoring Criteria</h4>
          {[
            { name: 'Technical Skills', weight: 30 },
            { name: 'Teamwork', weight: 25 },
            { name: 'Defense', weight: 20 },
            { name: 'Game Strategy', weight: 15 },
            { name: 'Sportsmanship', weight: 10 },
          ].map((criteria, i) => (
            <div key={i} className="flex items-center justify-between p-3 mb-2" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{criteria.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Weight: {criteria.weight}%</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(val => (
                  <button key={val} style={{
                    width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                    fontWeight: 600, fontSize: '14px',
                  }}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>Participants</h4>
          {MOCK_PARTICIPANTS.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between p-3 mb-2" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{p.name}</span>
              <div className="flex items-center gap-3">
                <input type="number" min="0" max="100" placeholder="Score"
                  value={scores[p.id] || ''}
                  onChange={(e) => onScoreChange(p.id, e.target.value)}
                  style={{ width: 100, padding: '6px 10px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', textAlign: 'center' }}
                />
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/ 100</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4" style={{ background: 'rgba(92,184,92,0.08)', borderRadius: 'var(--radius-md)' }}>
          <h4 className="font-semibold mb-2" style={{ color: '#3d8b3d' }}>Anti-Cheating Check</h4>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <i className="bi bi-shield-check me-1"></i> All scores will be verified for consistency and bias detection.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="success" icon="bi-send" onClick={onSubmit}>Submit All Scores</Button>
        </div>
      </div>
    </Modal>
  );
}

// Participant Dashboard
function ParticipantDashboard() {
  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>My Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Track your events and performances</p>
        </div>
        <Button variant="primary" icon="bi-plus-circle">Join Event</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="bi-trophy" label="Events Joined" value={3} color="blue" />
        <StatCard icon="bi-bar-chart-line" label="Average Score" value="88.5" color="green" />
        <StatCard icon="bi-award" label="Rank" value="#1" color="purple" />
        <StatCard icon="bi-star" label="Wins" value="12" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>My Events</h3>
          <Table
            columns={[
              { header: 'Event', accessor: 'title', render: (r) => <span className="font-medium">{r.title}</span> },
              { header: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'success' : 'warning'}>{r.status}</Badge> },
              { header: 'Score', render: (r) => <span className="font-semibold">{r.participants > 100 ? Math.floor(Math.random() * 30 + 70) : '-'}</span> },
            ]}
            data={MOCK_EVENTS.slice(0, 4)}
          />
        </Card>

        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Upcoming Schedule</h3>
          <div className="space-y-3">
            {MOCK_EVENTS.filter(e => e.status !== 'completed').slice(0, 4).map(event => (
              <div key={event.id} className="flex items-center gap-3 p-3" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-sm)',
                  background: 'rgba(74,144,217,0.1)', color: '#4A90D9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  <i className="bi bi-calendar-event"></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{event.title}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{event.startDate} - {event.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// Audience Dashboard
function AudienceDashboard() {
  return (
    <div className="fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Audience Hub</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Vote, react, and engage with live events</p>
        </div>
        <Button variant="primary" icon="bi-broadcast">Live Events</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon="bi-hand-thumbs-up" label="Votes Cast" value={15} color="blue" />
        <StatCard icon="bi-stars" label="Predictions Won" value={8} color="green" />
        <StatCard icon="bi-people" label="Audience Rank" value="#42" color="purple" />
        <StatCard icon="bi-activity" label="Engagement" value="78%" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Live Events</h3>
          {MOCK_EVENTS.filter(e => e.status === 'active').map(event => (
            <div key={event.id} className="flex items-center justify-between p-4 mb-2" style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div>
                <p className="font-medium text-sm" style={{ color: 'var(--color-text-primary)' }}>{event.title}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{event.participants} participants</p>
              </div>
              <div className="flex gap-2">
                <button style={{ padding: '8px 16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', background: '#fff', cursor: 'pointer', color: '#4A90D9', fontSize: '13px' }}>
                  <i className="bi bi-hand-thumbs-up me-1"></i> Vote
                </button>
                <button style={{ padding: '8px', border: 'none', borderRadius: 'var(--radius-sm)', background: 'rgba(74,144,217,0.1)', cursor: 'pointer', color: '#4A90D9' }}>
                  <i className="bi bi-trophy"></i>
                </button>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Leaderboard</h3>
          <Table
            columns={[
              { header: 'Rank', render: (r) => <span className="font-bold" style={{ color: r.rank <= 3 ? '#4A90D9' : 'var(--color-text-secondary)' }}>#{r.rank}</span> },
              { header: 'Team', accessor: 'name' },
              { header: 'Score', accessor: 'score' },
            ]}
            data={MOCK_LEADERBOARD.slice(0, 5)}
          />
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><OrganizerDashboard /></ProtectedRoute>} />
        <Route path="/judges" element={<ProtectedRoute><JudgeDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default App;