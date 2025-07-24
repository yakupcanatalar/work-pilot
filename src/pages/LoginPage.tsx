import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useUserService } from '../services/UserService';
import '../assets/styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish } from '@fortawesome/free-solid-svg-icons';
import { useToken } from '../utils/TokenContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useUserService();
  const { setAccessToken, setRefreshToken } = useToken();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      navigate('/admin');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Giriş sırasında bir hata oluştu';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Şifre sıfırlama bağlantısı e-posta adresinize gönderilecek! 🐟');
  };

  return (
    <div className="login-bg">
      <Card className="login-card">
        <h4 className="text-center mb-4" style={{ color: '#6f42c1', fontWeight: 700 }}>Giriş Yap</h4>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="login-label">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="login-input"
                placeholder="E-posta adresinizi girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="login-label">Şifre</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="login-input"
                placeholder="Şifrenizi girin"
              />
            </Form.Group>

            <Button
              disabled={loading}
              className="w-100 login-btn"
              type="submit"
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </Form>
          <div className="login-register-text">
            Hesabınız yok mu?{' '}
            <Link to="/register" className="login-register-link">
              Kayıt Ol
            </Link>
            <Button
              variant="link"
              className="w-100 mt-2 d-flex align-items-center justify-content-center"
              type="button"
              onClick={handleForgotPassword}
            >
              <FontAwesomeIcon icon={faFish} className="me-2" />
              Şifremi Unuttum
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginPage;