import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { getUnreadCount } from '../../data/notifications';
import { renderIcon } from '../common/Icon';
import './Navbar.css';

// Navbar component
const Navbar = ({ onMenuToggle = null, isSidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const { notifications } = useNotification();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const handleLogout = () => {
    logout();
    navigate('/?modal=login');
  };

  return (
    <nav className={`navbar navbar-offset-${isSidebarOpen ? 'full' : 'none'}`}>
      <div className="navbar-start">
        {onMenuToggle && (
          <button className="navbar-menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
            {renderIcon('menu')}
          </button>
        )}
        <Link to="/dashboard" className="navbar-brand">
          FairPlay
        </Link>
      </div>

      <div className="navbar-center">
        <input
          type="text"
          className="navbar-search"
          placeholder="Search events, users..."
        />
      </div>

      <div className="navbar-end">
        {/* Notifications */}
        <div className="navbar-item navbar-notifications">
          <button
            className="navbar-icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
          >
            {renderIcon('bell')}
            {unreadCount > 0 && <span className="navbar-badge">{unreadCount}</span>}
          </button>
          {showNotifications && (
            <div className="navbar-dropdown navbar-notifications-dropdown">
              <div className="navbar-dropdown-header">Notifications</div>
              {notifications.length > 0 ? (
                <div className="navbar-notifications-list">
                  {notifications.slice(0, 5).map((notif) => (
                    <div key={notif.id} className="navbar-notification-item">
                      <span className="notification-type-icon">
                        {renderIcon(notif.type)}
                      </span>
                      <div className="notification-content">
                        <div className="notification-message">{notif.message}</div>
                        <div className="notification-time">{new Date(notif.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="navbar-dropdown-empty">No notifications</div>
              )}
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="navbar-item navbar-profile">
          <button
            className="navbar-profile-button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User menu"
          >
            <img src={user?.avatar} alt={user?.name} className="navbar-avatar" />
            <span className="navbar-profile-name">{user?.name}</span>
          </button>

          {showProfileMenu && (
            <div className="navbar-dropdown navbar-profile-dropdown">
              <Link to="/profile" className="navbar-dropdown-item">
                Profile
              </Link>
              <Link to="/settings" className="navbar-dropdown-item">
                Settings
              </Link>
              <hr className="navbar-dropdown-divider" />
              <button className="navbar-dropdown-item navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
