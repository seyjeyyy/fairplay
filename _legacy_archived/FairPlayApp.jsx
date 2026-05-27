import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import Icons from './components/Icons';
import { AdminDashboard, OrganizerDashboard, JudgeDashboard, ParticipantDashboard } from './components/RoleDashboards';
import GlobalAuthModal from './components/auth/GlobalAuthModal';

// ============================================================================
// CSS STYLES - Injected globally
// ============================================================================
const styles = `
:root {
  --bg-primary: #000000;
  --bg-secondary: #0f1419;
  --bg-tertiary: #1a1f2e;
  --bg-hover: #2a2f3e;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --text-dark: #000000;
  --accent-cyan: #06b6d4;
  --accent-blue: #0084ff;
  --accent-purple: #9333ea;
  --accent-pink: #ec4899;
  --accent-green: #10b981;
  --accent-yellow: #fbbf24;
  --accent-red: #ef4444;
  --border-color: #2d3748;
  --border-light: #3d4556;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.2);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.3);
  --shadow-neon: 0 0 20px rgba(6,182,212,0.3);
  --transition-base: 0.2s ease-in-out;
  --transition-slow: 0.3s ease-in-out;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body, #root {
  width: 100%;
  height: 100%;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  scroll-behavior: smooth;
}

body {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--text-primary);
}

a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; }
input, textarea, select { font-family: inherit; color: inherit; }

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb {
  background: var(--accent-cyan);
  border-radius: var(--radius-md);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Button Component Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  border: none;
  cursor: pointer;
  font-size: var(--font-size-base);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-xs { padding: 4px 8px; font-size: var(--font-size-xs); }
.btn-sm { padding: 6px 12px; font-size: var(--font-size-sm); }
.btn-md { padding: 10px 16px; font-size: var(--font-size-base); }
.btn-lg { padding: 14px 24px; font-size: var(--font-size-lg); }
.btn-xl { padding: 18px 32px; font-size: var(--font-size-xl); }

.btn-primary {
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
  color: var(--text-dark);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.6);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border: 2px solid var(--accent-cyan);
}

.btn-secondary:hover {
  background: var(--bg-hover);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.btn-danger {
  background: var(--accent-red);
  color: white;
}

.btn-danger:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
}

.btn-ghost:hover {
  background: var(--bg-hover);
  border-color: var(--accent-cyan);
  color: var(--accent-cyan);
}

.btn-success {
  background: var(--accent-green);
  color: white;
}

.btn-warning {
  background: var(--accent-yellow);
  color: var(--text-dark);
}

.btn-full-width { width: 100%; }

.btn-loading {
  pointer-events: none;
  opacity: 0.7;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Input Component Styles */
.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.input-group label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
}

.input-field {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-base);
  transition: all var(--transition-base);
}

.input-field:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  background: var(--bg-secondary);
}

.input-field::placeholder {
  color: var(--text-secondary);
}

.input-error {
  border-color: var(--accent-red);
}

.input-error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.input-helper-text {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

.input-error-text {
  font-size: var(--font-size-xs);
  color: var(--accent-red);
}

/* Card Component Styles */
.card {
  background: rgba(26, 31, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.card-hover:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

/* StatCard Component Styles */
.stat-card {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(0, 132, 255, 0.1));
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  animation: fadeInUp 0.6s ease-out;
}

.stat-icon {
  font-size: 32px;
  animation: float 4s ease-in-out infinite;
}

.stat-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Tabs Component Styles */
.tabs-container { display: flex; flex-direction: column; gap: var(--spacing-lg); }
.tabs-header {
  display: flex;
  gap: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
  overflow-x: auto;
}

.tab-button {
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab-button.active {
  color: var(--accent-cyan);
  border-bottom-color: var(--accent-cyan);
}

.tab-button:hover {
  color: var(--accent-cyan);
}

.tabs-content { animation: fadeIn 0.3s ease-out; }

/* Badge Component Styles */
.badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 4px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-success { background: rgba(16, 185, 129, 0.2); color: var(--accent-green); }
.badge-warning { background: rgba(251, 191, 36, 0.2); color: var(--accent-yellow); }
.badge-danger { background: rgba(239, 68, 68, 0.2); color: var(--accent-red); }
.badge-info { background: rgba(6, 182, 212, 0.2); color: var(--accent-cyan); }
.badge-default { background: var(--bg-hover); color: var(--text-secondary); }

/* Navbar Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(180deg, rgba(15, 20, 25, 0.95), rgba(15, 20, 25, 0.8));
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  z-index: 100;
  gap: var(--spacing-lg);
}

.navbar-brand {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  flex: 1;
  margin-left: auto;
}

.navbar-menu a {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color var(--transition-base);
}

.navbar-menu a:hover {
  color: var(--accent-cyan);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.search-input {
  padding: 8px 16px;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  width: 250px;
  transition: all var(--transition-base);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
}

.notification-bell {
  position: relative;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 20px;
  cursor: pointer;
  transition: color var(--transition-base);
}

.notification-bell:hover { color: var(--accent-cyan); }

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: var(--accent-red);
  border-radius: 50%;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.dropdown-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  min-width: 250px;
  box-shadow: var(--shadow-xl);
  z-index: 1000;
}

.dropdown-item {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background var(--transition-base);
  font-size: var(--font-size-sm);
}

.dropdown-item:last-child { border-bottom: none; }

.dropdown-item:hover { background: var(--bg-hover); }

.dropdown-separator {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

/* Sidebar Styles */
.sidebar {
  position: fixed;
  left: 0;
  top: 70px;
  height: calc(100vh - 70px);
  background: linear-gradient(180deg, rgba(15, 20, 25, 0.98), rgba(15, 20, 25, 0.95));
  border-right: 1px solid rgba(6, 182, 212, 0.1);
  overflow-y: auto;
  transition: width var(--transition-base);
  z-index: 99;
}

.sidebar-expanded { width: 250px; }
.sidebar-collapsed { width: 72px; }

.sidebar-menu { list-style: none; padding: var(--spacing-lg) 0; }

.sidebar-item {
  padding: var(--spacing-sm) var(--spacing-lg);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-left: 3px solid transparent;
  font-size: var(--font-size-base);
}

.sidebar-item:hover {
  background: var(--bg-hover);
  color: var(--accent-cyan);
}

.sidebar-item.active {
  background: rgba(6, 182, 212, 0.1);
  color: var(--accent-cyan);
  border-left-color: var(--accent-cyan);
}

.sidebar-collapsed .sidebar-item-label { display: none; }
.sidebar-collapsed .sidebar-item { justify-content: center; padding: var(--spacing-lg); }

.sidebar-toggle {
  background: transparent;
  border: none;
  color: var(--accent-cyan);
  font-size: 18px;
  cursor: pointer;
  padding: var(--spacing-md) var(--spacing-lg);
  transition: color var(--transition-base);
}

.sidebar-toggle:hover { color: var(--accent-blue); }

/* Dashboard Layout */
.dashboard-layout {
  margin-left: 250px;
  margin-top: 70px;
  transition: margin-left var(--transition-base);
  min-height: calc(100vh - 70px);
  padding: var(--spacing-xl);
}

.dashboard-layout.collapsed { margin-left: 72px; }

.main-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* Event Card */
.event-card {
  background: rgba(26, 31, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.event-card:hover {
  transform: translateY(-4px);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

.event-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.event-meta {
  display: flex;
  gap: var(--spacing-md);
  margin: var(--spacing-md) 0;
  flex-wrap: wrap;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.event-action { margin-top: var(--spacing-md); }

/* Table Styles */
.table-container {
  overflow-x: auto;
  margin: var(--spacing-lg) 0;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(26, 31, 46, 0.5);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table thead th {
  padding: var(--spacing-md);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-weight: 600;
  text-align: left;
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.table tbody tr {
  border-bottom: 1px solid var(--border-light);
  transition: background var(--transition-base);
}

.table tbody tr:hover {
  background: var(--bg-tertiary);
}

.table td {
  padding: var(--spacing-md);
  color: var(--text-primary);
}

/* Forms */
.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-xl);
}

/* Modal Styles - Improved */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.2s ease-out;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  opacity: 1;
  animation: fadeInUp 0.3s ease-out;
}

/* Smooth transitions for better UX */
.btn, .input-field, a {
  transition: all var(--transition-base);
}

.btn:active {
  transform: scale(0.98);
}

/* Enhanced focus states */
.input-field:focus {
  outline: none;
  border-color: var(--accent-cyan);
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.1);
  background: var(--bg-secondary);
}

/* Improved scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--accent-cyan);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-blue);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: var(--spacing-2xl);
  padding: var(--spacing-xl);
  margin-top: 70px;
}

.hero-content h1 {
  font-size: var(--font-size-4xl);
  font-weight: 900;
  background: linear-gradient(135deg, var(--text-primary), var(--accent-cyan), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  margin-bottom: var(--spacing-lg);
  animation: fadeInUp 0.6s ease-out;
}

.hero-content p {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
}

.hero-visual {
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glow-orb {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at 30% 30%, var(--accent-cyan), var(--accent-blue));
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
  filter: blur(40px);
  opacity: 0.6;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-2xl) 0;
  padding: var(--spacing-xl);
}

.stat-box {
  text-align: center;
  animation: countUp 0.8s ease-out;
}

.stat-number {
  font-size: var(--font-size-4xl);
  font-weight: 900;
  background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-text {
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  margin-top: var(--spacing-sm);
}

/* Features Section */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin: var(--spacing-2xl) 0;
}

.feature-card {
  background: rgba(26, 31, 46, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  transition: all var(--transition-base);
  animation: fadeInUp 0.6s ease-out;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(6, 182, 212, 0.3);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
}

.feature-icon { font-size: 40px; margin-bottom: var(--spacing-md); }

/* Section Container */
.section {
  padding: var(--spacing-2xl) var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: var(--spacing-lg);
    min-height: auto;
    margin-top: 70px;
  }

  .hero-content h1 {
    font-size: var(--font-size-2xl);
  }

  .navbar-menu {
    display: none;
  }

  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .dashboard-layout {
    margin-left: 0;
    padding: var(--spacing-lg);
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  /* Modal improvements for mobile */
  [style*="position: fixed"][style*="top: 50%"] {
    width: 95% !important;
    max-width: calc(100vw - 20px) !important;
    max-height: 85vh !important;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: var(--font-size-xl);
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  /* Optimize touch targets */
  .btn {
    min-height: 48px;
  }

  input, select, textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}
`;

// ============================================================================
// MOCK DATA
// ============================================================================
const MOCK_USERS = {
  admin: { id: 1, email: 'admin@fairplay.com', name: 'Admin User', role: 'admin', avatar: '👑' },
  organizer: { id: 2, email: 'organizer@fairplay.com', name: 'Organizer User', role: 'organizer', avatar: '📋' },
  judge: { id: 3, email: 'judge@fairplay.com', name: 'Judge User', role: 'judge', avatar: '⚖️' },
  participant: { id: 4, email: 'participant@fairplay.com', name: 'Participant User', role: 'participant', avatar: '👤' },
};

const MOCK_EVENTS = [
  { id: 1, title: 'National Coding Challenge 2025', type: 'contest', status: 'active', participants: 128, maxParticipants: 200, startDate: '2025-06-01', endDate: '2025-06-03', organizer: 'Tech Corp', prize: '₱50,000', category: 'Technology' },
  { id: 2, title: 'City Basketball Tournament', type: 'tournament', status: 'upcoming', participants: 64, maxParticipants: 64, startDate: '2025-07-15', endDate: '2025-07-20', organizer: 'Sports Assoc', prize: '₱25,000', category: 'Sports' },
  { id: 3, title: 'Valorant Championship Series', type: 'esports', status: 'active', participants: 32, maxParticipants: 32, startDate: '2025-05-20', endDate: '2025-05-25', organizer: 'Esports PH', prize: '₱100,000', category: 'Gaming' },
  { id: 4, title: 'Inter-School Debate Cup', type: 'debate', status: 'completed', participants: 24, maxParticipants: 32, startDate: '2025-04-10', endDate: '2025-04-12', organizer: 'Edu Dept', prize: 'Trophy', category: 'Academic' },
  { id: 5, title: 'Regional Art Competition', type: 'contest', status: 'upcoming', participants: 45, maxParticipants: 100, startDate: '2025-08-01', endDate: '2025-08-02', organizer: 'Arts Council', prize: '₱15,000', category: 'Arts' },
];

const ANALYTICS = {
  totalEvents: 47,
  activeEvents: 12,
  totalParticipants: 3842,
  totalJudges: 156,
  completedEvents: 28,
  upcomingEvents: 7,
  avgParticipantsPerEvent: 82,
  totalPrizePool: '₱2,450,000',
};

const LEADERBOARD = [
  { rank: 1, name: 'Team Alpha', score: 9850, wins: 15, losses: 2, events: 17, badge: '🥇' },
  { rank: 2, name: 'Digital Warriors', score: 9420, wins: 14, losses: 3, events: 17, badge: '🥈' },
  { rank: 3, name: 'Code Ninjas', score: 8990, wins: 12, losses: 4, events: 16, badge: '🥉' },
  { rank: 4, name: 'Storm Breakers', score: 8640, wins: 11, losses: 5, events: 16, badge: '🏅' },
  { rank: 5, name: 'Phoenix Rising', score: 8210, wins: 10, losses: 6, events: 16, badge: '🏅' },
];

const NOTIFICATIONS = [
  { id: 1, message: 'New event registration opened: Valorant Championship', time: '2 min ago', read: false, type: 'info' },
  { id: 2, message: 'Your score has been submitted for Coding Challenge', time: '1 hr ago', read: false, type: 'success' },
  { id: 3, message: 'Team Alpha just won the Basketball Tournament', time: '3 hr ago', read: true, type: 'info' },
];

// ============================================================================
// CONTEXTS
// ============================================================================
const AuthContext = createContext();
const NotificationContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fairplay_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Initial load handled in useState
  }, []);

  const login = (email, role) => {
    const userKey = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].email === email);
    const userData = userKey ? MOCK_USERS[userKey] : null;
    if (userData) {
      localStorage.setItem('fairplay_user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('fairplay_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      time: 'now',
      read: false,
    };
    setNotifications([newNotification, ...notifications]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

// ============================================================================
// HOOKS
// ============================================================================
function useAuth() {
  return useContext(AuthContext);
}

function useNotifications() {
  return useContext(NotificationContext);
}

// ============================================================================
// COMPONENTS
// ============================================================================

// Button Component
function Button({ children, variant = 'primary', size = 'md', disabled = false, loading = false, onClick, fullWidth = false, className = '' }) {
  const variantClass = `btn-${variant}`;
  const sizeClass = `btn-${size}`;
  const widthClass = fullWidth ? 'btn-full-width' : '';
  const loadingClass = loading ? 'btn-loading' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${loadingClass} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <span className="spinner"></span>}
      {children}
    </button>
  );
}

// Input Component
function Input({ type = 'text', label, placeholder, value, onChange, error, helperText, fullWidth = true }) {
  const inputClass = error ? 'input-field input-error' : 'input-field';

  return (
    <div className="input-group" style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <label>{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
      {error && <span className="input-error-text">{error}</span>}
      {!error && helperText && <span className="input-helper-text">{helperText}</span>}
    </div>
  );
}

// Select Component
function Select({ label, name, value, onChange, options, fullWidth = true }) {
  return (
    <div className="input-group" style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="input-field"
        style={{
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        <option value="">-- Select --</option>
        {options?.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Card Component
function Card({ children, className = '', onClick, hoverable = false }) {
  const hoverClass = hoverable ? 'card-hover' : '';
  return (
    <div className={`card ${hoverClass} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

// StatCard Component
function StatCard({ label, value, icon, color = 'cyan' }) {
  const colors = {
    cyan: '--accent-cyan',
    purple: '--accent-purple',
    blue: '--accent-blue',
    pink: '--accent-pink',
    green: '--accent-green',
  };

  return (
    <Card className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color: `var(${colors[color]})` }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </Card>
  );
}

// Badge Component
function Badge({ children, variant = 'default' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

// Tabs Component
function Tabs({ tabs, defaultActive = 0 }) {
  const [active, setActive] = useState(defaultActive);

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`tab-button ${active === idx ? 'active' : ''}`}
            onClick={() => setActive(idx)}
          >
            {tab.icon && <span>{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[active]?.content}
      </div>
    </div>
  );
}

// Navbar Component - Updated with Icons
function Navbar() {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Icons.Zap size={24} style={{ display: 'inline', marginRight: '8px' }} />
        FairPlay
      </Link>

      {user && (
        <>
          <div className="navbar-menu" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <Link to="/dashboard">Dashboard</Link>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="navbar-actions">
            <input type="text" placeholder="Search..." className="search-input" style={{ paddingLeft: 'var(--spacing-lg)' }} />

            <div style={{ position: 'relative' }}>
              <button
                className="notification-bell"
                onClick={() => setNotificationOpen(!notificationOpen)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Icons.Bell size={20} color="var(--text-secondary)" />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {notificationOpen && (
                <div className="dropdown-menu" style={{ width: '300px' }}>
                  {notifications.length === 0 ? (
                    <div className="dropdown-item" style={{ color: 'var(--text-secondary)' }}>No notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="dropdown-item">
                        <div style={{ marginBottom: '4px' }}>{notif.message}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{notif.time}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <button
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-cyan)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Icons.Users size={20} />
                {user.name.split(' ')[0]}
              </button>

              {profileOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">Profile</div>
                  <div className="dropdown-item">Settings</div>
                  <div className="dropdown-separator"></div>
                  <div className="dropdown-item" onClick={handleLogout} style={{ color: 'var(--accent-red)' }}>
                    <Icons.LogOut size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

// Sidebar Component - Updated with Icons
function Sidebar({ isOpen, onToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    // Correctly set the main dashboard path based on the user's role
    const dashboardPath = {
      admin: '/admin',
      organizer: '/organizer',
      judge: '/judge',
      participant: '/participant',
    }[user?.role] || '/dashboard';

    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard, path: dashboardPath },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { id: 'analytics', label: 'Analytics', icon: Icons.BarChart, path: '/admin/analytics' },
        { id: 'users', label: 'Users', icon: Icons.Users, path: '/admin/users' },
        { id: 'roles', label: 'Roles & Approvals', icon: Icons.Award, path: '/admin/roles' },
        { id: 'audit', label: 'Audit Trail', icon: Icons.FileText, path: '/admin/audit' },
        { id: 'reports', label: 'Reports', icon: Icons.FileText, path: '/admin/reports' },
        { id: 'settings', label: 'Settings', icon: Icons.Settings, path: '/admin/settings' },
      ];
    } else if (user?.role === 'organizer') {
      return [
        ...baseItems,
        { id: 'create', label: 'Create Event', icon: Icons.Plus, path: '/organizer/create-event' },
        { id: 'events', label: 'My Events', icon: Icons.Calendar, path: '/organizer/events' },
        { id: 'contestants', label: 'Contestants', icon: Icons.Target, path: '/organizer/contestants' },
        { id: 'judges', label: 'Judges', icon: Icons.Award, path: '/organizer/judges' },
        { id: 'brackets', label: 'Brackets', icon: Icons.Trophy, path: '/organizer/brackets' },
        { id: 'scoring', label: 'Live Scoring', icon: Icons.BarChart, path: '/organizer/scoring' },
        { id: 'analytics', label: 'Analytics', icon: Icons.BarChart, path: '/organizer/analytics' },
        { id: 'settings', label: 'Settings', icon: Icons.Settings, path: '/organizer/settings' },
      ];
    } else if (user?.role === 'judge') {
      return [
        ...baseItems,
        { id: 'assigned', label: 'Assigned Events', icon: Icons.Calendar, path: '/judge/events' },
        { id: 'scoresheet', label: 'Score Sheets', icon: Icons.FileText, path: '/judge/scoring' },
        { id: 'review', label: 'Review Scores', icon: Icons.Award, path: '/judge/review' },
        { id: 'history', label: 'History', icon: Icons.Clock, path: '/judge/history' },
        { id: 'settings', label: 'Settings', icon: Icons.Settings, path: '/judge/settings' },
      ];
    } else {
      return [
        ...baseItems,
        { id: 'events', label: 'Events', icon: Icons.Calendar, path: '/participant/events' },
        { id: 'schedule', label: 'My Schedule', icon: Icons.Clock, path: '/participant/schedule' },
        { id: 'scores', label: 'My Scores', icon: Icons.Trophy, path: '/participant/scores' },
        { id: 'announcements', label: 'Announcements', icon: Icons.Bell, path: '/participant/announcements' },
        { id: 'profile', label: 'My Profile', icon: Icons.Users, path: '/participant/profile' },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleMenuClick = (item) => {
    navigate(item.path);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
      <button className="sidebar-toggle" onClick={onToggle}>
        {isOpen ? <Icons.ChevronLeft size={20} /> : <Icons.ChevronRight size={20} />}
      </button>

      <ul className="sidebar-menu">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <li
              key={item.id}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => handleMenuClick(item)}
              title={!isOpen ? item.label : ''}
            >
              <item.icon size={20} color={isActive ? 'var(--accent-cyan)' : 'currentColor'} />
              <span className="sidebar-item-label">{item.label}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

// ============================================================================
// PAGES
// ============================================================================

// Login Modal Component
function LoginModal({ isOpen, onClose, onSwitchToRegister }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    const userEmail = MOCK_USERS[role]?.email || '';
    setEmail(userEmail);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 300));

    if (login(email, password)) {
      onClose();
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 999 }} />}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -60%)',
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'all 0.3s ease-out',
        width: '90%',
        maxWidth: '500px',
      }}>
        <Card style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-xs)' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Sign in to your account</p>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                Demo Roles:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-lg)',
              }}>
                {['admin', 'organizer', 'judge', 'participant'].map(role => (
                  <Button
                    key={role}
                    variant={email === MOCK_USERS[role]?.email ? 'primary' : 'ghost'}
                    size="sm"
                    type="button"
                    onClick={() => handleRoleSelect(role)}
                  >
                    {MOCK_USERS[role]?.avatar} {role}
                  </Button>
                ))}
              </div>
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              error={error && !email ? 'Email is required' : ''}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              error={error && !password ? 'Password is required' : ''}
              style={{ marginTop: 'var(--spacing-lg)' }}
            />

            {error && <p style={{ color: 'var(--accent-red)', marginTop: 'var(--spacing-md)', fontSize: 'var(--font-size-sm)' }}>❌ {error}</p>}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              style={{ marginTop: 'var(--spacing-lg)' }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginTop: 'var(--spacing-lg)',
              fontSize: 'var(--font-size-sm)',
            }}>
              Don't have an account?{' '}
              <button type="button" onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: '600' }}>
                Sign up
              </button>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}

// Register Modal Component
function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      await new Promise(r => setTimeout(r, 300));
      onClose();
      onSwitchToLogin();
      setLoading(false);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      {isOpen && <div className="modal-backdrop" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)', zIndex: 999 }} />}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: isOpen ? 'translate(-50%, -50%)' : 'translate(-50%, -60%)',
        zIndex: 1000,
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'all 0.3s ease-out',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <Card style={{ padding: 'var(--spacing-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-xs)' }}>Create Account</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Join FairPlay today</p>
            </div>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              style={{ marginTop: 'var(--spacing-lg)' }}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password (8+ chars)"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              style={{ marginTop: 'var(--spacing-lg)' }}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              style={{ marginTop: 'var(--spacing-lg)' }}
            />

            <div className="input-group" style={{ marginTop: 'var(--spacing-lg)' }}>
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="input-field">
                <option value="">Select a role</option>
                <option value="organizer">Event Organizer</option>
                <option value="judge">Judge</option>
                <option value="participant">Participant</option>
              </select>
              {errors.role && <span className="input-error-text">{errors.role}</span>}
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              style={{ marginTop: 'var(--spacing-xl)' }}
              onClick={handleSubmit}
            >
              Create Account
            </Button>

            <p style={{
              textAlign: 'center',
              color: 'var(--text-secondary)',
              marginTop: 'var(--spacing-lg)',
              fontSize: 'var(--font-size-sm)',
            }}>
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: '600' }}>
                Sign in
              </button>
            </p>
          </form>
        </Card>
      </div>
    </>
  );
}

// Landing Page with Modal Auth
function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [stats] = useState([
    { value: '10K+', label: 'Events' },
    { value: '100K+', label: 'Participants' },
    { value: '99.9%', label: 'Uptime' },
    { value: '50+', label: 'Countries' },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>Fair Play</h1>
          <p>The Ultimate Event Management Platform</p>
          <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
            Manage contests, tournaments, and esports events with real-time scoring and automatic rankings.
          </p>
          <div className="hero-buttons">
            <Button variant="primary" size="lg" onClick={() => setShowLoginModal(true)}>
              Get Started
            </Button>
            <Button variant="secondary" size="lg" onClick={() => setShowRegisterModal(true)}>
              Sign Up
            </Button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glow-orb"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-box" style={{ animationDelay: `${idx * 0.15}s` }}>
            <div className="stat-number">{stat.value}</div>
            <div className="stat-text">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="section" id="features">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          {[
            { icon: Icons.Calendar, title: 'Event Management', desc: 'Create and manage any type of event' },
            { icon: Icons.Zap, title: 'Real-Time Scoring', desc: 'Live score updates and rankings' },
            { icon: Icons.Trophy, title: 'Auto Rankings', desc: 'Automatic participant rankings' },
            { icon: Icons.BarChart, title: 'Analytics', desc: 'Detailed event analytics and insights' },
            { icon: Icons.Lock, title: 'Secure', desc: 'Enterprise-grade security' },
            { icon: Icons.Home, title: 'Accessible', desc: 'Works on all devices' },
          ].map((feature, idx) => (
            <Card key={idx} hoverable className="feature-card">
              <div className="feature-icon">
                <feature.icon size={40} color="var(--accent-cyan)" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Types */}
      <div className="section">
        <h2 className="section-title">Supported Event Types</h2>
        <div className="features-grid">
          {[
            { icon: Icons.Sliders, title: 'Contests', desc: 'Rubric-based judging' },
            { icon: Icons.Trophy, title: 'Tournaments', desc: 'Bracket-style competitions' },
            { icon: Icons.Target, title: 'Esports', desc: 'Team-based digital events' },
            { icon: Icons.BookOpen, title: 'Debates', desc: 'Discussion-format events' },
          ].map((type, idx) => (
            <Card key={idx} hoverable className="feature-card">
              <div className="feature-icon">
                <type.icon size={40} color="var(--accent-blue)" />
              </div>
              <h3 className="feature-title">{type.title}</h3>
              <p className="feature-desc">{type.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="section" style={{ textAlign: 'center', paddingBottom: 'var(--spacing-2xl)' }} id="contact">
        <h2 className="section-title">Ready to Transform Your Events?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', fontSize: 'var(--font-size-lg)' }}>
          Start managing your events today with FairPlay
        </p>
        <Button variant="primary" size="lg" onClick={() => setShowLoginModal(true)}>
          Start Free Today
        </Button>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        padding: 'var(--spacing-xl)',
        textAlign: 'center',
        color: 'var(--text-secondary)',
        marginTop: 'var(--spacing-2xl)',
      }}>
        <p>⚡ FairPlay © 2025 | The Ultimate Event Management Platform</p>
      </footer>

      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}

// Login Page - REMOVED (moved to modal)
function LoginPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}

// Register Page - REMOVED (moved to modal)
function RegisterPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);
  return null;
}

// Placeholder Page for routes under construction
function PlaceholderPage({ title }) {
  const navigate = useNavigate();
  return (
    <div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-lg)' }}>{title}</h1>
      <Card>
        <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
          <Icons.Construction size={48} style={{ marginBottom: 'var(--spacing-md)', color: 'var(--accent-yellow)' }} />
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)', marginBottom: 'var(--spacing-sm)' }}>Page Under Construction</h2>
          <p>The content for the "{title}" page is currently being developed.</p>
          <p>Please check back soon!</p>
          <Button variant="secondary" size="md" onClick={() => navigate(-1)} style={{ marginTop: 'var(--spacing-lg)' }}>
            Go Back
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Dashboard Layout Component
function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <>
      <Navbar />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className={`dashboard-layout ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  );
}

// Dashboard Page - Now uses role-specific components
function DashboardPage() {
  const { user } = useAuth();

  const getDashboard = () => {
    if (user?.role === 'admin') return <AdminDashboard />;
    if (user?.role === 'organizer') return <OrganizerDashboard />;
    if (user?.role === 'judge') return <JudgeDashboard />;
    return <ParticipantDashboard />;
  };

  return getDashboard();
}

// Create Event Page
function CreateEventPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    venue: '',
    format: '',
    prizePool: '',
    firstPrize: '',
    secondPrize: '',
    thirdPrize: '',
    rules: '',
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    navigate('/dashboard');
  };

  const stepTitles = ['Basic Info', 'Schedule', 'Prizes & Rules', 'Review'];

  return (
    <>
      <Navbar />
      <Sidebar isOpen={true} onToggle={() => {}} />

      <div className="dashboard-layout">
        <div className="main-content">
          <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Create Event</h1>

          {/* Step Indicator */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)',
            justifyContent: 'space-between',
          }}>
            {stepTitles.map((title, idx) => (
              <div key={idx} style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: idx < step ? 'var(--accent-cyan)' : idx === step - 1 ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
                  border: '2px solid' + (idx <= step - 1 ? 'var(--accent-cyan)' : 'var(--border-color)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  color: idx < step ? 'var(--text-dark)' : 'var(--text-secondary)',
                }}>
                  {idx < step - 1 ? '✓' : idx + 1}
                </div>
                <span style={{ color: idx < step ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}>
                  {title}
                </span>
              </div>
            ))}
          </div>

          <Card>
            {/* Step 1 */}
            {step === 1 && (
              <div className="form-group">
                <h2>Basic Event Information</h2>
                <Input
                  label="Event Title"
                  placeholder="Enter event title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <div className="input-group">
                  <label>Event Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                    <option value="">Select event type</option>
                    <option value="contest">Contest</option>
                    <option value="tournament">Tournament</option>
                    <option value="esports">Esports</option>
                    <option value="debate">Debate</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                    <option value="">Select category</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Academic">Academic</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
                <Input
                  label="Description"
                  placeholder="Describe your event"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <Input
                  label="Max Participants"
                  type="number"
                  placeholder="Maximum number of participants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="form-group">
                <h2>Schedule & Location</h2>
                <Input
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <Input
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                <Input
                  label="Venue/Location"
                  placeholder="Where will the event take place?"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                />
                <div className="input-group">
                  <label>Format</label>
                  <select name="format" value={formData.format} onChange={handleChange} className="input-field">
                    <option value="">Select format</option>
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="form-group">
                <h2>Prizes & Rules</h2>
                <Input
                  label="Total Prize Pool"
                  placeholder="e.g., ₱100,000"
                  name="prizePool"
                  value={formData.prizePool}
                  onChange={handleChange}
                />
                <Input
                  label="1st Place Prize"
                  placeholder="e.g., ₱50,000"
                  name="firstPrize"
                  value={formData.firstPrize}
                  onChange={handleChange}
                />
                <Input
                  label="2nd Place Prize"
                  placeholder="e.g., ₱30,000"
                  name="secondPrize"
                  value={formData.secondPrize}
                  onChange={handleChange}
                />
                <Input
                  label="3rd Place Prize"
                  placeholder="e.g., ₱20,000"
                  name="thirdPrize"
                  value={formData.thirdPrize}
                  onChange={handleChange}
                />
                <div className="input-group">
                  <label>Rules & Guidelines</label>
                  <textarea
                    name="rules"
                    placeholder="Enter event rules and guidelines"
                    value={formData.rules}
                    onChange={handleChange}
                    className="input-field"
                    rows="5"
                  ></textarea>
                </div>
                <div className="input-group">
                  <label>
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleChange}
                      style={{ marginRight: 'var(--spacing-sm)' }}
                    />
                    I agree to the Terms & Conditions
                  </label>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="form-group">
                <h2>Review Event Details</h2>
                <Card>
                  <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Event Title</p>
                      <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: '600' }}>{formData.title}</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                      <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Type</p>
                        <p style={{ fontWeight: '600' }}>{formData.type}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Category</p>
                        <p style={{ fontWeight: '600' }}>{formData.category}</p>
                      </div>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Dates</p>
                      <p style={{ fontWeight: '600' }}>{formData.startDate} to {formData.endDate}</p>
                    </div>
                    <div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Prize Pool</p>
                      <p style={{ fontWeight: '600', color: 'var(--accent-cyan)' }}>{formData.prizePool}</p>
                    </div>
                  </div>
                </Card>

                {step === 4 && (
                  <div style={{
                    padding: 'var(--spacing-lg)',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: 'var(--radius-lg)',
                    marginTop: 'var(--spacing-lg)',
                    textAlign: 'center',
                  }}>
                    <p style={{ color: 'var(--accent-green)', fontWeight: '600' }}>✓ Ready to create event!</p>
                  </div>
                )}
              </div>
            )}

            {/* Form Actions */}
            <div className="form-actions" style={{ marginTop: 'var(--spacing-xl)' }}>
              {step > 1 && (
                <Button variant="ghost" size="lg" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < 4 && (
                <Button variant="primary" size="lg" onClick={handleNext}>
                  Next
                </Button>
              )}
              {step === 4 && (
                <Button variant="success" size="lg" onClick={handleSubmit}>
                  Create Event
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

// Protected Route
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  return user ? children : null;
}

// Error Boundary Component - Enhanced
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: '#000',
          color: '#fff',
          padding: '40px',
          fontFamily: 'monospace',
          zIndex: 9999,
          overflow: 'auto'
        }}>
          <h1>⚠️ Application Error</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>Sorry! Something went wrong. Please try again.</p>
          <pre style={{ background: '#111', padding: '20px', borderRadius: '8px', marginTop: '20px', color: '#ff6b6b', fontSize: '12px', overflow: 'auto' }}>
            {this.state.error?.toString()}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => {
            this.setState({ hasError: false, error: null });
            window.location.reload();
          }} style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#06b6d4',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            Reload & Reset
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// APP COMPONENT
// ============================================================================

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppComponent() {
  useEffect(() => {
    // Inject global styles
    const style = document.createElement('style');
    style.textContent = styles;
    document.head.appendChild(style);

    // Apply critical styles to root
    const root = document.getElementById('root');
    if (root) {
      root.style.width = '100%';
      root.style.height = '100%';
      root.style.minHeight = '100vh';
      root.style.background = '#000000';
      root.style.color = '#ffffff';
      root.style.display = 'block';
    }

    // Apply styles to body
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.background = '#000000';
    document.body.style.color = '#ffffff';
    document.documentElement.style.background = '#000000';
  }, []);

  return (
    <ErrorBoundary>
      <Router future={{ 
        v7_startTransition: true, 
        v7_relativeSplatPath: true 
      }}>
        <GlobalAuthModal />
        <ScrollToTop />
        <AuthProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<LandingPage />} />
              <Route path="/features" element={<LandingPage />} />
              <Route path="/contact" element={<LandingPage />} />
              <Route path="/login" element={<Navigate to="/?modal=login" replace />} />
              <Route path="/register" element={<Navigate to="/?modal=register" replace />} />

              {/* Protected Routes with Dashboard Layout */}
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><DashboardPage /></DashboardLayout></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="/admin/analytics" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Analytics" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="User Management" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/events" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Event Management" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/judges" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Judge Management" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Reports" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Settings" /></DashboardLayout></ProtectedRoute>} />

              {/* Organizer Routes */}
              <Route path="/organizer/create-event" element={<ProtectedRoute><DashboardLayout><CreateEventPage /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/events" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="My Events" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/teams" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Team Management" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/participants" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Participant Management" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/brackets" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Brackets" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/scoring" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Live Scoring" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/organizer/leaderboards" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Leaderboards" /></DashboardLayout></ProtectedRoute>} />

              {/* Judge Routes */}
              <Route path="/judge/assigned-events" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Assigned Events" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/judge/score-sheets" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Score Sheets" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/judge/rankings" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Rankings" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/judge/schedule" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Schedule" /></DashboardLayout></ProtectedRoute>} />

              {/* Participant Routes */}
              <Route path="/participant/events" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Events" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/participant/teams" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="My Teams" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/participant/rankings" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="My Rankings" /></DashboardLayout></ProtectedRoute>} />
              <Route path="/participant/certificates" element={<ProtectedRoute><DashboardLayout><PlaceholderPage title="Certificates" /></DashboardLayout></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </NotificationProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default AppComponent;
