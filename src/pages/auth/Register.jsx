import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'organizer' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const result = await register({ name: form.name, email: form.email, password: form.password, role: 'organizer' });
    if (result.success) {
      navigate('/organizer', { replace: true });
      return;
    }
    setError(result.error || 'Registration failed.');
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 480,
          background: 'rgba(15,20,25,0.9)',
          border: '1px solid rgba(6,182,212,0.15)',
          borderRadius: 20, padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #06b6d4, #0084ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: '#000',
            margin: '0 auto 12px',
          }}>
            F
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Create Account</h1>
          <p style={{ color: '#a0aec0', fontSize: 14 }}>Join FairPlay today</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 16,
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            color: '#ef4444', fontSize: 13,
          }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>Full Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Create a password (8+ characters)"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6 }}>Role</label>
              <div
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 10,
                  background: 'rgba(26,31,46,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: '#fff', fontSize: 14, outline: 'none',
                }}
              >
                Event Organizer only - redirects to organizer dashboard after registration
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%', marginTop: 24, padding: '12px 24px',
              background: 'linear-gradient(135deg, #06b6d4, #0084ff)',
              color: '#000', border: 'none', borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 20px rgba(6,182,212,0.3)',
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: 13, marginTop: 20 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
