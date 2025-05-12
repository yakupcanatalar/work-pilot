import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page py-5" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={10} lg={8}>
            <h1 className="text-center fw-bold mb-4" style={{ color: '#6f42c1' }}>
              Hakkımızda
            </h1>
            <p className="lead text-center text-muted">
              Atalar Tasarım Yazılım, modern teknolojiyi yaratıcı fikirlerle buluşturarak işletmelere
              dijital çözümler sunan dinamik bir yazılım ve tasarım firmasıdır.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="border-0 shadow-sm p-4">
              <Card.Body>
                <p className="mb-4 fs-5 text-secondary">
                  Müşterilerimizin ihtiyaçlarına özel yazılım çözümleri geliştiriyor, markaların dijital
                  dünyada güçlü ve sürdürülebilir bir varlık göstermelerini sağlıyoruz.
                </p>
                <p className="mb-4 fs-5 text-secondary">
                  Her biri alanında uzman ekibimizle; web ve mobil uygulama geliştirme, kurumsal yazılım çözümleri,
                  kullanıcı dostu arayüz tasarımları ve dijital dönüşüm danışmanlığı konularında hizmet veriyoruz.
                </p>
                <p className="mb-4 fs-5 text-secondary">
                  İşimizi sadece kod yazarak değil, müşterilerimizin hayallerini ve hedeflerini anlayarak yapıyoruz.
                  Hedefimiz; işletmenizin başarısına değer katmak, teknolojiyi sizin için çalışır hale getirmektir.
                </p>
                <p className="fs-5 fw-semibold fst-italic text-center text-muted mt-4">
                  Atalar Tasarım Yazılım – Tasarlıyoruz, Kodluyoruz, Güçlendiriyoruz.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutPage;
