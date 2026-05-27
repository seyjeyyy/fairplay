import React from 'react';
import { Link } from 'react-router-dom';
import { renderIcon } from '../common/Icon';
import './PublicLayout.css';

// Public layout for landing pages
const PublicLayout = ({ children }) => {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="public-header-content">
          <Link to="/" className="public-logo">
            {renderIcon('brand', 'public-logo-icon')}
            <span className="public-logo-text">FairPlay</span>
          </Link>
          <nav className="public-nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/features">Features</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/?modal=login" className="public-nav-login">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="public-main">{children}</main>

      <footer className="public-footer">
        <div className="public-footer-content">
          <div className="public-footer-section">
            <h4>FairPlay</h4>
            <p>Universal Platform for Automated Event Management and Scoring</p>
          </div>
          <div className="public-footer-section">
            <h4>Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/features">Features</Link></li>
            </ul>
          </div>
          <div className="public-footer-section">
            <h4>Contact</h4>
            <p>Email: info@fairplay.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className="public-footer-bottom">
          <p>&copy; 2024 FairPlay. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
