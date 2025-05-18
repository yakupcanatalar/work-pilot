import React, { useState, useEffect } from 'react';
import { Nav, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faUsers,
  faProjectDiagram,
  faTasks,
  faChartBar,
  faAngleLeft,
  faAngleRight,
} from '@fortawesome/free-solid-svg-icons';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992);

  // Responsive collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setCollapsed(true);
      else setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className="left-pane bg-white position-fixed vh-100 shadow d-flex flex-column"
      style={{
        width: collapsed ? 80 : 260,
        transition: 'width 0.2s',
        zIndex: 100,
      }}
    >
      <div className="d-flex justify-content-end align-items-center p-2">
        <Button
          variant="light"
          size="sm"
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Toggle sidebar"
          className="border-0"
        >
          <FontAwesomeIcon icon={collapsed ? faAngleRight : faAngleLeft} />
        </Button>
      </div>
      <Nav className="flex-column p-3 flex-grow-1">
        <Nav.Link as={Link} to="/admin/dashboard" className="mb-2 rounded" title="Dashboard">
          <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
          {!collapsed && 'Dashboard'}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/customer" className="mb-2 rounded" title="Müşteriler">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          {!collapsed && 'Müşteriler'}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/work-flow" className="mb-2 rounded" title="İş Akışları">
          <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
          {!collapsed && 'İş Akışları'}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/task" className="mb-2 rounded" title="Görevler">
          <FontAwesomeIcon icon={faTasks} className="me-2" />
          {!collapsed && 'Görevler'}
        </Nav.Link>
        <Nav.Link as={Link} to="/admin/statistics" className="mb-2 rounded" title="İstatistikler">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          {!collapsed && 'İstatistikler'}
        </Nav.Link>
      </Nav>
      {/* User Dropdown at Bottom */}
      <div className="p-3 border-top mt-auto">
        <Dropdown drop="up">
          <Dropdown.Toggle
            variant="link"
            className="d-flex align-items-center link-dark text-decoration-none p-0"
            id="dropdownUser2"
            style={{ width: '100%' }}
          >
            <img
              src={require('../assets/images/pp.png')}
              alt="Profile"
              width="32"
              height="32"
              className="rounded-circle me-2"
            />
            {!collapsed && <strong>Çağrı ATALAR</strong>}
          </Dropdown.Toggle>
          <Dropdown.Menu className="text-small shadow" aria-labelledby="dropdownUser2">
            <Dropdown.Item className="mb-2 rounded" as={Link} to="/admin/settings">Ayarlar</Dropdown.Item>
            <Dropdown.Item className="mb-2 rounded" as={Link} to="/admin/profile">Profilim</Dropdown.Item>
            <Dropdown.Item className="mb-2 rounded" as={Link} to="/contact">Hata Bildir</Dropdown.Item>
            <Dropdown.Item className="mb-2 rounded" as={Link} to="/about">S.S.S</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={onLogout}>Çıkış</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;