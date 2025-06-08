import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket } from '@fortawesome/free-solid-svg-icons';

// Gradient ve outline stilleri
const gradientStyle = {
  background: 'linear-gradient(90deg, #6f42c1, #0d6efd)',
  border: 'none',
  color: '#fff',
  fontWeight: 500,
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const outlineGradientStyle = {
  background: 'transparent',
  border: '2px solid #6f42c1',
  color: '#6f42c1',
  fontWeight: 500,
  transition: 'transform 0.2s, box-shadow 0.2s'
};

const Navigation: React.FC = () => {
  const navigate = useNavigate();

  // Hover animasyonunu eklemek için event handler
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'translateY(-3px) scale(1.04)';
    e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(111,66,193,0.12)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = '';
    e.currentTarget.style.boxShadow = '';
  };

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
            onClick={() => navigate('/login')}
            className="me-2 px-3 py-2"
            style={outlineGradientStyle}
            variant="light"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Giriş Yap
          </Button>
          <Button
            onClick={() => navigate('/register')}
            className="px-3 py-2"
            style={gradientStyle}
            variant="light"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Kayıt Ol
          </Button>
        </div>
      </Container>
    </Navbar>
  );
};

export default Navigation;