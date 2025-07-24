import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { faSave, faCog, faSpaghettiMonsterFlying } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../components/PageHeader';

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('tr');
  const [notifications, setNotifications] = useState({
    sms: false,
    mail: false,
    whatsapp: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ayarlar kaydedildi!');
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <Container className="py-4">
      <PageHeader title="Ayarlar" icon={faCog} />
      <Card className="shadow-sm">
        <Card.Header>
          <FontAwesomeIcon icon={faCog} className="me-2" />
          <span className="fw-bold">Ayarlar</span>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSave}>
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Tema</Form.Label>
                  <Form.Select
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                  >
                    <option value="light">Açık</option>
                    <option disabled value="dark">Koyu</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Dil</Form.Label>
                  <Form.Select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                  >
                    <option value="tr">Türkçe</option>
                    <option disabled value="en">English</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Bildirim Tercihleri</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check
                      type="checkbox"
                      label="SMS"
                      name="sms"
                      disabled
                      checked={notifications.sms}
                      onChange={handleNotificationChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Mail"
                      disabled
                      name="mail"
                      checked={notifications.mail}
                      onChange={handleNotificationChange}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Whatsapp"
                      name="whatsapp"
                      disabled
                      checked={notifications.whatsapp}
                      onChange={handleNotificationChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button type="submit" variant="success">
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Kaydet
              </Button>
            </div>
            <div className="mt-4 text-muted" style={{ fontSize: 14 }}>
              <strong>Not:</strong> Yeni sürümlerde koyu tema, Bildirim seçenekleri ve dil seçenekleri eklenecektir .
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;