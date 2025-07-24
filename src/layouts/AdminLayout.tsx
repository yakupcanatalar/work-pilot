import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useToken } from '../utils/TokenContext';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed] = useState(false);
  const { setAccessToken, setRefreshToken } = useToken();

  const handleLogout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    navigate('/login');
  };

  // const handleSidebarCollapse = (isCollapsed: boolean) => {
  //   setCollapsed(isCollapsed);
  // };

  return (
    <div>
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