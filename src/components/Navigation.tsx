import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="white" expand="lg" className="py-3 border-bottom">
      <Container>
        {/* Sol Tarafta Logo ve Marka İsmi */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center me-0">
          <FontAwesomeIcon
            icon={faRocket}
            className="me-2"
            style={{ color: '#6f42c1', fontSize: '1.8rem' }}
          />
          <span style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            background: 'linear-gradient(90deg, #6f42c1, #0d6efd)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            WorkPilot
          </span>
        </Navbar.Brand>

        {/* Sağ Tarafta Auth Butonları */}
        <div className="d-flex">
          <Button
            variant="outline-primary"
            onClick={() => navigate('/login')}
            className="me-2 px-3 py-2"
            style={{ fontWeight: '500' }}
          >
            Giriş Yap
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/register')}
            className="px-3 py-2"
            style={{ fontWeight: '500' }}
          >
            Kayıt Ol
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Navigation;