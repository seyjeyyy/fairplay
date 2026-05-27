import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('../pages/auth/Login'));
const RegisterPage = lazy(() => import('../pages/auth/Register'));
const LandingPage = lazy(() => import('../pages/public/Landing'));
const PremiumLandingPage = lazy(() => import('../pages/public/PremiumLanding'));
const DashboardPage = lazy(() => import('../pages/dashboard/Dashboard'));
const CreateEventPage = lazy(() => import('../pages/organizer/CreateEvent'));

// Magandang placeholder para hindi mag-hang o mag-infinite load yung system
// kapag kinlick mo yung mga sidebar buttons na wala pang actual page files.
const PlaceholderPage = ({ title }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', padding: '2rem', textAlign: 'center', color: '#fff' }}>
    <span style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚧</span>
    <h2 style={{ fontSize: '1.8rem', color: '#06b6d4', marginBottom: '0.5rem' }}>{title}</h2>
    <p style={{ color: '#a0aec0', maxWidth: '400px' }}>
      This section is under construction. Tinanggal na natin yung mabibigat na loaders. 
      Dito natin ilalagay ang system features kapag ready na.
    </p>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/?modal=login" replace />;
  }

  return children;
};

// Routes array for the application
export const routes = [
  // Public Routes
  {
    path: '/',
    element: <PremiumLandingPage />, // Pinalitan ko na para dumiretso sa magandang landing
    public: true
  },

  // Dashboard Routes (Protected)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },

  // ================= ADMIN ROUTES =================
  {
    path: '/admin/analytics',
    element: <ProtectedRoute><PlaceholderPage title="Admin Analytics" /></ProtectedRoute>
  },
  {
    path: '/admin/users',
    element: <ProtectedRoute><PlaceholderPage title="User Management" /></ProtectedRoute>
  },
  {
    path: '/admin/events',
    element: <ProtectedRoute><PlaceholderPage title="Event Management" /></ProtectedRoute>
  },
  {
    path: '/admin/judges',
    element: <ProtectedRoute><PlaceholderPage title="Judge Management" /></ProtectedRoute>
  },
  {
    path: '/admin/reports',
    element: <ProtectedRoute><PlaceholderPage title="System Reports" /></ProtectedRoute>
  },
  {
    path: '/admin/settings',
    element: <ProtectedRoute><PlaceholderPage title="Admin Settings" /></ProtectedRoute>
  },

  // =============== ORGANIZER ROUTES ===============
  {
    path: '/organizer/create-event',
    element: <ProtectedRoute><CreateEventPage /></ProtectedRoute>
  },
  {
    path: '/organizer/my-events',
    element: <ProtectedRoute><PlaceholderPage title="My Events" /></ProtectedRoute>
  },
  {
    path: '/organizer/teams',
    element: <ProtectedRoute><PlaceholderPage title="Teams Management" /></ProtectedRoute>
  },
  {
    path: '/organizer/participants',
    element: <ProtectedRoute><PlaceholderPage title="Participants" /></ProtectedRoute>
  },
  {
    path: '/organizer/settings',
    element: <ProtectedRoute><PlaceholderPage title="Organizer Settings" /></ProtectedRoute>
  },

  // ================= JUDGE ROUTES =================
  {
    path: '/judge/assigned-events',
    element: <ProtectedRoute><PlaceholderPage title="Assigned Events" /></ProtectedRoute>
  },
  {
    path: '/judge/score-sheets',
    element: <ProtectedRoute><PlaceholderPage title="Score Sheets" /></ProtectedRoute>
  },
  {
    path: '/judge/rankings',
    element: <ProtectedRoute><PlaceholderPage title="Live Rankings" /></ProtectedRoute>
  },
  {
    path: '/judge/schedule',
    element: <ProtectedRoute><PlaceholderPage title="Judging Schedule" /></ProtectedRoute>
  },

  // ============== PARTICIPANT ROUTES ==============
  {
    path: '/participant/events',
    element: <ProtectedRoute><PlaceholderPage title="Available Events" /></ProtectedRoute>
  },
  {
    path: '/participant/teams',
    element: <ProtectedRoute><PlaceholderPage title="My Teams" /></ProtectedRoute>
  },
  {
    path: '/participant/rankings',
    element: <ProtectedRoute><PlaceholderPage title="My Rankings" /></ProtectedRoute>
  },
  {
    path: '/participant/certificates',
    element: <ProtectedRoute><PlaceholderPage title="My Certificates" /></ProtectedRoute>
  },

  // ================ FALLBACK ROUTE ================
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];

export const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner fullScreen text="Loading page..." />}>
    {children}
  </Suspense>
);