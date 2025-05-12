import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Nav, Dropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faTachometerAlt,
  faUsers,
  faProjectDiagram,
  faTasks,
  faChartBar,
  faCog,
  faSignOutAlt,
  faUserEdit
} from '@fortawesome/free-solid-svg-icons';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      {/* Fixed Left Pane */}
      <div className="left-pane bg-white position-fixed vh-100 shadow">
        {/* User Info Section */}
        <div className="user-section p-4 border-bottom">
          <div className="d-flex align-items-center justify-content-between">
            <Dropdown>
              <Dropdown.Toggle variant="link" className="p-0 user-toggle">
                <div className="d-flex align-items-center">
                  <div className="avatar me-3">AU</div>
                  <div className="user-info">
                    <h6 className="mb-0">Admin User</h6>
                    <small className="text-muted">admin@workpilot.com</small>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/admin/profile">
                  <FontAwesomeIcon icon={faUserEdit} className="me-2" />
                  Profili Düzenle
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Çıkış Yap
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown>
              <Dropdown.Toggle variant="link" className="p-0 text-dark">
                <FontAwesomeIcon icon={faBell} />
                <Badge pill bg="danger" className="ms-1">3</Badge>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>Bildirimler</Dropdown.Header>
                <Dropdown.Item>Yeni görev atandı</Dropdown.Item>
                <Dropdown.Item>Sistem güncellemesi</Dropdown.Item>
                <Dropdown.Item>Yeni mesajınız var</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Navigation Menu */}
        <Nav className="flex-column p-3">
          <Nav.Link as={Link} to="/admin/dashboard" className="mb-2 rounded">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/customers" className="mb-2 rounded">
            <FontAwesomeIcon icon={faUsers} className="me-2" />
            Müşteriler
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/workflows" className="mb-2 rounded">
            <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
            İş Akışları
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/tasks" className="mb-2 rounded">
            <FontAwesomeIcon icon={faTasks} className="me-2" />
            Görevler
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/statistics" className="mb-2 rounded">
            <FontAwesomeIcon icon={faChartBar} className="me-2" />
            İstatistikler
          </Nav.Link>
          <Nav.Link as={Link} to="/admin/settings" className="mb-2 rounded">
            <FontAwesomeIcon icon={faCog} className="me-2" />
            Ayarlar
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content" style={{ marginLeft: '280px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;