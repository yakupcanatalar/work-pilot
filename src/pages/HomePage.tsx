import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faShieldAlt,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: faChartLine,
      title: "Gelişmiş Analitik",
      description: "Üretkenliğinizi artırmak ve ilerlemeyi takip etmek için gerçek zamanlı öngörüler."
    },
    {
      icon: faUsers,
      title: "Takım İşbirliği",
      description: "Entegre iletişim araçlarıyla sorunsuz takım çalışması."
    },
    {
      icon: faShieldAlt,
      title: "Güvenli Platform",
      description: "İçiniz rahat olsun diye kurumsal düzeyde güvenlik."
    },
    {
      icon: faLightbulb,
      title: "Akıllı AI Özellikler",
      description: "İş akışınızı optimize etmek için akıllı öneriler."
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="py-5" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container className="text-center">
          <h1 className="display-4 fw-bold mb-4">
            <span style={{ color: '#6f42c1' }}>İş</span> Proje Yönetim Aracı
          </h1>
          <p className="lead mb-5 mx-auto" style={{ maxWidth: '700px' }}>
            WorkPilot, modern iş akışları için tasarlanmış hepsi bir arada platformumuzla takımların projeleri daha hızlı teslim etmesine yardımcı olur.
          Hemen üye olun, işlerinizi zahmetsizce yönetmeye başlayın.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="primary" 
              size="lg" 
              className="px-4"
              href="/register"
            >
              Ücretsiz Başlayın
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg" 
              className="px-4"
              href="/about"
            >
              Daha Fazla Bilgi
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <Container>
          <Row className="g-4 justify-content-center">
            {features.map((feature, index) => (
              <Col key={index} lg={3} md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center p-4">
                    <div className="mb-4">
                      <FontAwesomeIcon 
                        icon={feature.icon} 
                        size="2x" 
                        style={{ color: '#6f42c1' }} 
                      />
                    </div>
                    <Card.Title className="fw-bold mb-3">{feature.title}</Card.Title>
                    <Card.Text className="text-muted">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

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
    </div>
  );
};

export default HomePage;