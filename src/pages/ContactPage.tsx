import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page py-5" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
      <Container>
        <Row className="justify-content-center mb-5">
          <Col md={10} lg={8} className="text-center">
            <h1 className="fw-bold mb-4" style={{ color: '#6f42c1' }}>Bize Ulaşın</h1>
            <p className="text-muted lead">
              Sorularınızı yanıtlamaktan memnuniyet duyarız. Aşağıdaki formu doldurabilir ya da doğrudan bizimle iletişime geçebilirsiniz.
            </p>
          </Col>
        </Row>

        <Row className="g-4">
          {/* İletişim Bilgileri */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h4 className="mb-4" style={{ color: '#6f42c1' }}>İletişim Bilgileri</h4>
                <p><strong>Telefon:</strong> <a href="tel:+905468580300" className="text-dark text-decoration-none">0546 858 03 00</a></p>
                <p><strong>E-posta:</strong> <a href="mailto:info@atalartasarim.com" className="text-dark text-decoration-none">info@atalartasarim.com</a></p>
                <p><strong>Adres:</strong> Samsun, Fatih Mahallesi, Türkiye</p>

                <div className="mt-4">
                  <iframe
                    title="Ofis Haritası"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3029.7051818196946!2d36.32507511572344!3d41.296776879272875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40871980db7dd0ff%3A0x649e1589fdd807b2!2sFatih%2C%20Samsun!5e0!3m2!1str!2str!4v1689699999999!5m2!1str!2str"
                    width="100%"
                    height="250"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Form */}
          <Col md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body>
                <h4 className="mb-4" style={{ color: '#6f42c1' }}>İletişim Formu</h4>
                <Form>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Adınız</Form.Label>
                    <Form.Control type="text" placeholder="Adınızı girin" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>E-posta</Form.Label>
                    <Form.Control type="email" placeholder="E-posta adresiniz" />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="message">
                    <Form.Label>Mesajınız</Form.Label>
                    <Form.Control as="textarea" rows={5} placeholder="Mesajınızı yazın" />
                  </Form.Group>
                  <div className="text-end">
                    <Button variant="primary" type="submit">Gönder</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactPage;
