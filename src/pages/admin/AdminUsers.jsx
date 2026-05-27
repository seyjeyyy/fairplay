import { useState } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Lock, Trash2, UserPlus, Search } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@fairplay.com', role: 'admin', status: 'active', joined: '2025-01-15', events: 47 },
    { id: 2, name: 'Organizer User', email: 'organizer@fairplay.com', role: 'organizer', status: 'active', joined: '2025-02-20', events: 12 },
    { id: 3, name: 'Judge User', email: 'judge@fairplay.com', role: 'judge', status: 'active', joined: '2025-03-10', events: 8 },
    { id: 4, name: 'John Participant', email: 'john@example.com', role: 'participant', status: 'active', joined: '2025-04-05', events: 3 },
    { id: 5, name: 'Jane Coach', email: 'jane@example.com', role: 'organizer', status: 'suspended', joined: '2025-03-01', events: 5 },
  ]);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
  };

  const toolbarStyle = {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 10px 24px rgba(15,23,42,0.06)',
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  };

  return (
    <DashboardLayout title="User Management" subtitle="Manage platform users and their roles">
      <div style={toolbarStyle}>
        <div style={{ position: 'relative', width: 300 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            style={{
              padding: '10px 14px 10px 34px', borderRadius: 10,
              background: '#ffffff', border: '1px solid #e2e8f0',
              color: '#0f172a', fontSize: 13, outline: 'none', width: '100%',
            }}
          />
        </div>
        <button style={{
          padding: '10px 18px', borderRadius: 10,
          background: 'linear-gradient(135deg, #2563eb, #0ea5e9)',
          color: '#ffffff', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer',
          boxShadow: '0 10px 26px rgba(37,99,235,0.22)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      <div style={cardStyle}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                {['Name', 'Email', 'Role', 'Status', 'Events', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderBottom: '1px solid #f1f5f9' }}
                >
                  <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 10,
                      background: 'rgba(37,99,235,0.12)',
                      color: '#2563eb',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
                    }}>
                      {u.name.charAt(0)}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{u.name}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: u.role === 'admin' ? 'rgba(37,99,235,0.12)' : u.role === 'organizer' ? 'rgba(14,165,233,0.12)' : u.role === 'judge' ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.12)',
                      color: u.role === 'admin' ? '#1d4ed8' : u.role === 'organizer' ? '#0284c7' : u.role === 'judge' ? '#2563eb' : '#2563eb',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: u.status === 'active' ? 'rgba(37,99,235,0.12)' : 'rgba(239,68,68,0.12)',
                      color: u.status === 'active' ? '#1d4ed8' : '#ef4444',
                    }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{u.events}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>{u.joined}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2563eb',
                      }} aria-label="Edit user">
                        <Pencil size={14} />
                      </button>
                      <button style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#2563eb',
                      }} aria-label="Lock user">
                        <Lock size={14} />
                      </button>
                      <button style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#ef4444',
                      }} aria-label="Delete user">
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
    </DashboardLayout>
  );
}