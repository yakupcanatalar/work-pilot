import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  // Listen to sidebar collapse state via callback
  const handleSidebarCollapse = (isCollapsed: boolean) => {
    setCollapsed(isCollapsed);
  };

  return (
    <div className="admin-container">
      <Sidebar onLogout={handleLogout} />
      <div
        className="main-content"
        style={{ marginLeft: collapsed ? 70 : 280, transition: 'margin-left 0.2s' }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;