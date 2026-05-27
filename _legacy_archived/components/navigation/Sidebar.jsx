import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';
import useAuthStore from '../../store/authStore';

// In a real app, you'd use an icon library like react-icons.
// These are placeholders.
const Icon = ({ name }) => {
    const icons = {
        dashboard: '📊', analytics: '📈', users: '👥', events: '🎉', judges: '⚖️', reports: '📄', settings: '⚙️',
        create: '➕', myEvents: '🗓️', teams: '🤝', participants: '👤',
        assigned: '📋', scoreSheets: '📝', rankings: '🏆', schedule: '🕒', certificates: '📜',
        brand: '⚡', collapse: '◀️', expand: '▶️', announcements: '🔔', profile: '👤'
    };
    return <span className="sidebar-icon">{icons[name] || '❓'}</span>;
};

const sidebarItems = {
    admin: [
        { path: '/admin', icon: 'dashboard', label: 'Dashboard', end: true },
        { path: '/admin/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/admin/users', icon: 'users', label: 'Users' },
        { path: '/admin/roles', icon: 'judges', label: 'Roles & Approvals' },
        { path: '/admin/audit', icon: 'reports', label: 'Audit Trail' },
        { path: '/admin/reports', icon: 'reports', label: 'Reports' },
        { path: '/admin/settings', icon: 'settings', label: 'Settings' },
    ],
    organizer: [
        { path: '/organizer', icon: 'dashboard', label: 'Dashboard', end: true },
        { path: '/organizer/create-event', icon: 'create', label: 'Create Event' },
        { path: '/organizer/events', icon: 'myEvents', label: 'My Events' },
        { path: '/organizer/contestants', icon: 'participants', label: 'Contestants' },
        { path: '/organizer/judges', icon: 'judges', label: 'Judges' },
        { path: '/organizer/brackets', icon: 'teams', label: 'Brackets' },
        { path: '/organizer/scoring', icon: 'scoreSheets', label: 'Live Scoring' },
        { path: '/organizer/analytics', icon: 'analytics', label: 'Analytics' },
        { path: '/organizer/settings', icon: 'settings', label: 'Settings' },
    ],
    judge: [
        { path: '/judge', icon: 'dashboard', label: 'Dashboard', end: true },
        { path: '/judge/events', icon: 'assigned', label: 'Assigned Events' },
        { path: '/judge/scoring', icon: 'scoreSheets', label: 'Score Sheets' },
        { path: '/judge/review', icon: 'rankings', label: 'Review Scores' },
        { path: '/judge/history', icon: 'schedule', label: 'History' },
        { path: '/judge/settings', icon: 'settings', label: 'Settings' },
    ],
    participant: [
        { path: '/participant', icon: 'dashboard', label: 'Dashboard', end: true },
        { path: '/participant/events', icon: 'events', label: 'Events' },
        { path: '/participant/schedule', icon: 'schedule', label: 'My Schedule' },
        { path: '/participant/scores', icon: 'rankings', label: 'My Scores' },
        { path: '/participant/announcements', icon: 'announcements', label: 'Announcements' },
        { path: '/participant/profile', icon: 'profile', label: 'My Profile' },
    ]
};

const Sidebar = () => {
    const { user } = useAuthStore();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => setIsCollapsed(!isCollapsed);

    // Determine which set of navigation items to display based on user role
    const navItems = sidebarItems[user?.role] || sidebarItems.participant;

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : 'expanded'}`}>
            <div className="sidebar-header">
                <div className="sidebar-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon name="brand" />
                    {!isCollapsed && <span className="sidebar-title">FairPlay</span>}
                </div>
            </div>

            <nav className="sidebar-content">
                <ul className="sidebar-menu">
                    {navItems.map((item) => (
                        <li key={item.path} className="sidebar-menu-item" title={isCollapsed ? item.label : ''}>
                            <NavLink
                                to={item.path}
                                end={item.end || false}
                                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                            >
                                <Icon name={item.icon} />
                                <span className="sidebar-label">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleToggle} className="sidebar-toggle-btn">
                    {isCollapsed ? <Icon name="expand" /> : <Icon name="collapse" />}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;