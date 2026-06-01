import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error } = useNotificationStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) { error('Please enter your email'); return; }
    setLoading(true);
    const result = login(email, password);
    if (result.success) {
      success(`Welcome back, ${result.user.name}!`);
      const roleRoutes = {
        admin: '/admin', organizer: '/organizer',
        judge: '/judge', participant: '/participant',
      };
      navigate(roleRoutes[result.user.role] || '/dashboard');
    } else {
      error('Invalid credentials.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      {/* Background effects */}
      <div style={{
        position: 'fixed', top: '-50%', left: '-50%', width: '200%', height: '200%',
        background: 'radial-gradient(circle at 30% 50%, rgba(6,182,212,0.05) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(0,132,255,0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        style={{ width: '100%', maxWidth: 440, position: 'relative' }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #06b6d4, #0084ff)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#000', marginBottom: 16,
          }}>
            F
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 8,
          }}>
            FairPlay
          </h1>
          <p style={{ color: '#a0aec0', fontSize: 14 }}>
            Enterprise Event Management & AI Judging Platform
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{
          background: 'rgba(15,20,25,0.8)',
          border: '1px solid rgba(6,182,212,0.12)',
          borderRadius: 20, padding: 32,
          backdropFilter: 'blur(16px)',
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
            Sign In
          </h2>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6, display: 'block' }}>
              Email
            </label>
            <input
              type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#a0aec0', marginBottom: 6, display: 'block' }}>
              Password
            </label>
            <input
              type="password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={inputStyle}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 12,
              background: loading ? '#333' : 'linear-gradient(135deg, #06b6d4, #0084ff)',
              border: 'none', color: loading ? '#666' : '#000',
              fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 20,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>

          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Link to="/register" style={{ color: '#06b6d4', fontSize: 13, textDecoration: 'none' }}>
              Don't have an account? Register
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: 10,
  background: 'rgba(15,20,25,0.9)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff', fontSize: 14, outline: 'none',
  transition: 'all 0.2s',
};
