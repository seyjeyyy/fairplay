import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Card from '../../components/common/Card';
import StatCard from '../../components/dashboard/StatCard';
import Tabs from '../../components/common/Tabs';
import { useAuth } from '../../hooks/useAuth';
import { getAnalyticsOverview, getRecentActivities } from '../../data/analytics';
import './Dashboard.css';

// Dashboard page
const DashboardPage = () => {
  const { user, userRole } = useAuth();
  const analytics = getAnalyticsOverview();
  const activities = getRecentActivities(5);

  // Role-based dashboard title
  const getDashboardTitle = () => {
    const titles = {
      admin: 'Admin Dashboard',
      organizer: 'Organizer Dashboard',
      judge: 'Judge Dashboard',
      participant: 'Participant Dashboard'
    };
    return titles[userRole] || 'Dashboard';
  };

  const tabs = [
    {
      label: 'Overview',
      icon: 'dashboard',
      content: (
        <div className="dashboard-overview">
          <div className="dashboard-stats-grid">
            <StatCard label="Total Events" value={analytics.totalEvents} icon="calendar" color="cyan" />
            <StatCard label="Active Events" value={analytics.activeEvents} icon="brand" color="purple" />
            <StatCard label="Participants" value={analytics.totalParticipants} icon="users" color="blue" />
            <StatCard label="Judges" value={analytics.totalJudges} icon="judges" color="pink" />
          </div>
        </div>
      )
    },
    {
      label: 'Recent Activity',
      icon: 'clipboard',
      content: (
        <div className="dashboard-activities">
          {activities.map((activity) => (
            <Card key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <div className="activity-title">{activity.action}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-meta">{activity.user}</div>
              </div>
              <div className="activity-time">
                {new Date(activity.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </Card>
          ))}
        </div>
      )
    },
    {
      label: 'Quick Access',
      icon: 'brand',
      content: (
        <div className="dashboard-quick-access">
          <Card className="quick-access-card">
            <h3>Frequently Used</h3>
            <ul className="quick-access-list">
              <li><a href="/organizer/events">My Events</a></li>
              <li><a href="/participant/events">Events I'm In</a></li>
              <li><a href="/dashboard/settings">Settings</a></li>
              <li><a href="/dashboard/profile">My Profile</a></li>
            </ul>
          </Card>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title={getDashboardTitle()} subtitle={`Welcome back, ${user?.name}!`}>
      <div className="dashboard-container">
        <Tabs tabs={tabs} defaultActive={0} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
