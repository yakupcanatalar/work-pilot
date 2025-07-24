import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUserService } from '../services/UserService';
import { useToken } from '../utils/TokenContext';
import '../assets/styles/login.css';
import { ErrorMessage } from '../utils/ErrorMessage';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmationPassword: '',
    companyName: '',
    phone: '',
    address: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { registerUser } = useUserService();
  const { setAccessToken, setRefreshToken } = useToken();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmationPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      navigate('/admin');
    } catch (err: any) {
      setError(ErrorMessage.get(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <Card className="login-card">
        <Card.Body>
          <h4 className="text-center mb-4" style={{ color: '#6f42c1', fontWeight: 700 }}>Kayıt Ol</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Ad</Form.Label>
                  <Form.Control
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Soyad</Form.Label>
                  <Form.Control
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Telefon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="login-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Şirket Adı</Form.Label>
                  <Form.Control
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="login-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="login-label">Adres</Form.Label>
              <Form.Control
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="login-input"
                as="textarea"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Şifre</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="login-label">Şifreyi Doğrula</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmationPassword"
                    value={formData.confirmationPassword}
                    onChange={handleChange}
                    required
                    className="login-input"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button
              disabled={loading}
              className="w-100 login-btn"
              type="submit"
            >
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
            </Button>
          </Form>
          <div className="login-register-text">
            Zaten hesabınız var mı?{' '}
            <Link to="/login" className="login-register-link">
              Giriş Yap
            </Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterPage;