import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/UserService';
import '../assets/styles/login.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmationPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);
      localStorage.setItem('accessToken', response.access_token);
      localStorage.setItem('refreshToken', response.refresh_token);
      navigate('/admin');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu';
      setError(message);
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