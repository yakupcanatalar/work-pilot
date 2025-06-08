import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faShieldAlt,
  faLightbulb,
  faRocket,
  faFilm,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import '../assets/styles/home.css'; 

// Hover animasyonu için handlerlar
const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.classList.add('home-btn-hover');
};

const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.classList.remove('home-btn-hover');
};

const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.classList.add('home-card-hover');
};

const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  e.currentTarget.classList.remove('home-card-hover');
};

const HomePage: React.FC = () => {
  const features = [
    {
      icon: faChartLine,
      title: "Gelişmiş Analitik",
      description: "Üretkenliğinizi artırmak ve ilerlemeyi takip etmek için gerçek zamanlı öngörüler ve detaylı raporlar."
    },
    {
      icon: faUsers,
      title: "Takım İşbirliği",
      description: "Entegre iletişim araçlarıyla sorunsuz takım çalışması ve proje koordinasyonu."
    },
    {
      icon: faShieldAlt,
      title: "Güvenli Platform",
      description: "İçiniz rahat olsun diye kurumsal düzeyde güvenlik ve veri koruması."
    },
    {
      icon: faLightbulb,
      title: "Akıllı AI Özellikler",
      description: "İş akışınızı optimize etmek için yapay zeka destekli akıllı öneriler."
    }
  ];

  return (
    <div className="home-bg">
      <main>
        <section className="py-4" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <Container>
            <Row className="align-items-center justify-content-center">
              <Col lg={10} xl={8} className="text-center">
                <div className="mb-4">
                  <span className="home-badge">
                    🚀 Yeni Nesil Proje Yönetimi
                  </span>
                </div>
                <h1 className="home-title">
                  İş Proje Yönetim Aracı
                  <br />
                </h1>
                <p className="home-lead">
                  WorkPilot, modern iş akışları için tasarlanmış hepsi bir arada platformumuzla 
                  takımların projeleri daha hızlı teslim etmesine yardımcı olur.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center align-items-center">
                  <Button
                    size="lg"
                    href="https://www.youtube.com/watch?v=qcJtPCje3sY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="home-btn-gradient d-flex align-items-center"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FontAwesomeIcon icon={faFilm} className="me-2" />
                    Animasyon Filmimiz
                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" style={{ fontSize: '14px' }} />
                  </Button>
                  <Button
                    size="lg"
                    href="/about"
                    className="home-btn-outline outline"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    Daha Fazla Bilgi
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-4 bg-white" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
          <Container>
            <Row className="mb-4">
              <Col lg={8} className="mx-auto text-center">
                <h2 className="fw-bold mb-2 home-section-title">
                  Neden WorkPilot?
                </h2>
                <p className="lead text-muted home-section-lead">
                  İş süreçlerinizi daha verimli hale getiren güçlü özellikler
                </p>
              </Col>
            </Row>
            <Row className="g-4">
              {features.map((feature, index) => (
                <Col key={index} lg={6} xl={3}>
                  <Card
                    className="h-100 text-center p-2 home-card"
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <Card.Body className="p-3">
                      <div className="home-icon-container">
                        <FontAwesomeIcon
                          icon={feature.icon}
                          style={{ fontSize: '14px', color: 'white' }}
                        />
                      </div>
                      <Card.Title className="fw-bold mb-2 home-card-title">
                        {feature.title}
                      </Card.Title>
                      <Card.Text className="text-muted home-card-text">
                        {feature.description}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-4 home-cta-section">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8} xl={6} className="text-center">
                <div className="mb-3">
                  <div className="home-cta-icon-bg">
                    <FontAwesomeIcon
                      icon={faRocket}
                      style={{ fontSize: '18px', color: 'white' }}
                    />
                  </div>
                </div>
                <h2 className="fw-bold mb-3 text-white home-cta-title">
                  Hemen Başlayın
                </h2>
                <p className="lead mb-4 text-white opacity-75 home-cta-lead">
                  WorkPilot ile proje yönetiminde yeni bir deneyim yaşayın. 
                  Sadece birkaç dakika içinde kaydolun ve üretkenliğinizi artırın.
                </p>
                <Button
                  size="lg"
                  href="/register"
                  className="home-btn-cta"
                  onMouseEnter={e => e.currentTarget.classList.add('home-btn-hover')}
                  onMouseLeave={e => e.currentTarget.classList.remove('home-btn-hover')}
                >
                  Ücretsiz Kayıt Ol
                  <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                </Button>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;