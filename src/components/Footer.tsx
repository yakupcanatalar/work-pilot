import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="footer-custom py-3">
      <Container className="text-center">
        <Row className="justify-content-center">
          <Col md={8} className="mb-2">
            <div className="d-flex justify-content-center gap-4 mb-2">
              <a href="#" className="text-dark fs-5" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-dark fs-5" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-dark fs-5" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="#" className="text-dark fs-5" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <div className="d-flex justify-content-center gap-3 mb-2 small">
              <a href="/about" className="text-muted text-decoration-none">Hakkımızda</a>
              <span className="text-muted">•</span>
              <a href="/contact" className="text-muted text-decoration-none">Bize Ulaşın</a>
            </div>
            <p className="text-muted small mb-0">
              &copy; {new Date().getFullYear()} Atalar Tasarım&Yazılım. Tüm hakları saklıdır.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
