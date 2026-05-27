import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PARTICIPANTS = [
  { id: 1, name: 'Juan Dela Cruz', event: 'Basketball', team: 'Team Alpha', checkedIn: false, time: null },
  { id: 2, name: 'Maria Santos', event: 'Volleyball', team: 'Team Beta', checkedIn: true, time: '08:45 AM' },
  { id: 3, name: 'Pedro Reyes', event: 'Chess', team: 'Team Gamma', checkedIn: false, time: null },
  { id: 4, name: 'Ana Lim', event: 'Dance', team: 'Team Delta', checkedIn: true, time: '08:30 AM' },
  { id: 5, name: 'Jose Garcia', event: 'Basketball', team: 'Team Alpha', checkedIn: false, time: null },
  { id: 6, name: 'Elena Cruz', event: 'Badminton', team: 'Team Zeta', checkedIn: true, time: '09:00 AM' },
  { id: 7, name: 'Carlos Tan', event: 'Esports', team: 'Team Epsilon', checkedIn: false, time: null },
  { id: 8, name: 'Sofia Mendoza', event: 'Larong Lahi', team: 'Team Eta', checkedIn: true, time: '08:15 AM' },
];

export default function QRAttendance() {
  const [participants, setParticipants] = useState(MOCK_PARTICIPANTS);
  const [scanMode, setScanMode] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const checkedIn = participants.filter(p => p.checkedIn).length;
  const total = participants.length;
  const attendanceRate = ((checkedIn / total) * 100).toFixed(1);

  const handleCheckIn = (id) => {
    setParticipants(prev => prev.map(p =>
      p.id === id ? { ...p, checkedIn: true, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) } : p
    ));
    setLastScanned(participants.find(p => p.id === id));
    setTimeout(() => setLastScanned(null), 3000);
  };

  const handleBarcodeScanned = (value) => {
    const participant = participants.find(p => p.id.toString() === value);
    if (participant && !participant.checkedIn) {
      handleCheckIn(participant.id);
    }
  };

  const filtered = participants.filter(p => {
    if (selectedEvent !== 'all' && p.event !== selectedEvent) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const events = [...new Set(participants.map(p => p.event))];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#212529' }}>QR Attendance</h1>
          <p style={{ color: '#6C757D' }}>Scan QR codes for participant check-in</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setScanMode(!scanMode)}
            style={{
              padding: '10px 24px',
              background: scanMode ? 'linear-gradient(135deg, #D9534F, #c9302c)' : 'linear-gradient(135deg, #4A90D9, #5BC0DE)',
              border: 'none', borderRadius: 12, color: '#fff',
              cursor: 'pointer', fontWeight: 600, fontSize: 14,
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <i className={`bi ${scanMode ? 'bi-x-lg' : 'bi-qr-code-scan'}`}></i>
            {scanMode ? 'Stop Scanner' : 'Scan QR'}
          </button>
          <button style={{ padding: '10px 20px', background: '#F8F9FA', border: '1px solid #DEE2E6', borderRadius: 12, color: '#212529', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
            <i className="bi bi-download me-2"></i>Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <div className="text-2xl font-bold" style={{ color: '#4A90D9' }}>{checkedIn}</div>
          <div className="text-sm" style={{ color: '#6C757D' }}>Checked In</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <div className="text-2xl font-bold" style={{ color: '#6C757D' }}>{total - checkedIn}</div>
          <div className="text-sm" style={{ color: '#6C757D' }}>Pending</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <div className="text-2xl font-bold" style={{ color: '#5CB85C' }}>{attendanceRate}%</div>
          <div className="text-sm" style={{ color: '#6C757D' }}>Attendance Rate</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}>
          <div className="text-2xl font-bold" style={{ color: '#F0AD4E' }}>{events.length}</div>
          <div className="text-sm" style={{ color: '#6C757D' }}>Active Events</div>
        </motion.div>
      </div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {scanMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#212529' }}>QR Scanner</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter ID manually..."
                  onKeyDown={e => { if (e.key === 'Enter') handleBarcodeScanned(e.target.value); }}
                  style={{
                    padding: '8px 12px', background: '#F8F9FA', border: '1px solid #DEE2E6',
                    borderRadius: 8, color: '#212529', fontSize: 13, outline: 'none', width: 200,
                  }}
                />
                <button onClick={() => setScanMode(false)} style={{ padding: '8px 16px', background: '#F8F9FA', border: '1px solid #DEE2E6', borderRadius: 8, cursor: 'pointer', color: '#6C757D' }}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
            <div style={{
              width: '100%', height: 200, borderRadius: 12,
              background: '#F1F3F5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8,
              border: '2px dashed #DEE2E6',
            }}>
              <i className="bi bi-qr-code-scan text-4xl" style={{ color: '#ADB5BD' }}></i>
              <p className="text-sm" style={{ color: '#6C757D' }}>Point camera at QR code or type participant ID</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Scanned Alert */}
      <AnimatePresence>
        {lastScanned && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ padding: '12px 20px', background: 'rgba(92,184,92,0.15)', border: '1px solid #5CB85C', borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <i className="bi bi-check-circle-fill" style={{ color: '#5CB85C', fontSize: 20 }}></i>
            <div>
              <span className="font-medium text-sm" style={{ color: '#3d8b3d' }}>{lastScanned.name}</span>
              <span className="text-sm" style={{ color: '#3d8b3d' }}> checked in successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative">
          <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#ADB5BD' }}></i>
          <input
            type="text" placeholder="Search participants..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 12px 10px 36px', background: '#F8F9FA', border: '1px solid #DEE2E6',
              borderRadius: 12, color: '#212529', fontSize: 14, outline: 'none', width: 280,
            }}
          />
        </div>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          style={{ padding: '10px 12px', background: '#F8F9FA', border: '1px solid #DEE2E6', borderRadius: 12, color: '#212529', fontSize: 14, outline: 'none', cursor: 'pointer' }}
        >
          <option value="all">All Events</option>
          {events.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      {/* Attendance Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF', overflow: 'hidden' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8F9FA' }}>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Name</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Event</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Team</th>
                <th className="text-center p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Status</th>
                <th className="text-center p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Time</th>
                <th className="text-center p-4 text-xs font-semibold uppercase" style={{ color: '#6C757D' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid #E9ECEF' }}
                  className="hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: p.checkedIn ? 'rgba(92,184,92,0.15)' : '#F1F3F5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: p.checkedIn ? '#5CB85C' : '#ADB5BD', fontSize: 14,
                      }}>
                        <i className={`bi ${p.checkedIn ? 'bi-person-check' : 'bi-person'}`}></i>
                      </div>
                      <span className="font-medium text-sm" style={{ color: '#212529' }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm" style={{ color: '#212529' }}>{p.event}</td>
                  <td className="p-4 text-sm" style={{ color: '#6C757D' }}>{p.team}</td>
                  <td className="p-4 text-center">
                    <span style={{
                      padding: '4px 12px', borderRadius: 20,
                      background: p.checkedIn ? 'rgba(92,184,92,0.15)' : 'rgba(240,173,78,0.15)',
                      color: p.checkedIn ? '#5CB85C' : '#F0AD4E',
                      fontSize: 12, fontWeight: 600,
                    }}>
                      <i className={`bi ${p.checkedIn ? 'bi-check-circle' : 'bi-clock'} me-1`}></i>
                      {p.checkedIn ? 'Present' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-4 text-center text-sm" style={{ color: '#6C757D' }}>{p.time || '--'}</td>
                  <td className="p-4 text-center">
                    {!p.checkedIn && (
                      <button
                        onClick={() => handleCheckIn(p.id)}
                        style={{
                          padding: '6px 16px', background: 'linear-gradient(135deg, #5CB85C, #4cae4c)',
                          border: 'none', borderRadius: 8, color: '#fff',
                          cursor: 'pointer', fontWeight: 600, fontSize: 12,
                        }}
                      >
                        <i className="bi bi-check-lg me-1"></i>Check In
                      </button>
                    )}
                    {p.checkedIn && (
                      <span className="text-xs" style={{ color: '#5CB85C' }}>
                        <i className="bi bi-check2-all me-1"></i>Done
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Attendance Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-6"
        style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF' }}
      >
        <h3 className="font-semibold mb-4" style={{ color: '#212529' }}>Attendance Progress</h3>
        <div style={{ height: 12, background: '#F1F3F5', borderRadius: 6, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${attendanceRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, #5CB85C, #4A90D9)`,
              borderRadius: 6,
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs" style={{ color: '#6C757D' }}>
          <span>{checkedIn} checked in</span>
          <span>{attendanceRate}% complete</span>
          <span>{total - checkedIn} remaining</span>
        </div>
      </motion.div>
    </div>
  );
}