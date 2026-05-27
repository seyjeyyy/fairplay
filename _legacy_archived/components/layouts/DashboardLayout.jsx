import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar';
import Navbar from '../navigation/Navbar';
import './DashboardLayout.css';

// Dashboard layout wrapper
const DashboardLayout = ({ children, title = '', subtitle = '' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className={`dashboard-container dashboard-container-${sidebarOpen ? 'open' : 'closed'}`}>
        <Navbar onMenuToggle={toggleSidebar} isSidebarOpen={sidebarOpen} />
        
        <main className="dashboard-main">
          {(title || subtitle) && (
            <div className="dashboard-header">
              {title && <h1 className="dashboard-title">{title}</h1>}
              {subtitle && <p className="dashboard-subtitle">{subtitle}</p>}
            </div>
          )}
          <div className="dashboard-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
