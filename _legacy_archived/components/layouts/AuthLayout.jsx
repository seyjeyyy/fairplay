import React from 'react';
import './AuthLayout.css';

// Auth layout for login/register pages
const AuthLayout = ({ children, title = '', subtitle = '' }) => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">FairPlay</h1>
            {title && <h2 className="auth-form-title">{title}</h2>}
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>
          <div className="auth-content">{children}</div>
        </div>
        <div className="auth-background">
          <div className="auth-bg-shapes">
            <div className="auth-shape auth-shape-1"></div>
            <div className="auth-shape auth-shape-2"></div>
            <div className="auth-shape auth-shape-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
