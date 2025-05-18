import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/UserService'; // Güncel servis yolu

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
      navigate('/admin'); // Başarılı kayıt sonrası admin sayfasına yönlendir
    } catch (err: any) {
      const message = err.response?.data?.message || 'Kayıt sırasında bir hata oluştu';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <h4 className="text-center mb-4">Kayıt Ol</h4>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control name="firstname" value={formData.firstname} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Soyad</Form.Label>
              <Form.Control name="lastname" value={formData.lastname} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifre</Form.Label>
              <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Şifreyi Doğrula</Form.Label>
              <Form.Control type="password" name="confirmationPassword" value={formData.confirmationPassword} onChange={handleChange} required />
            </Form.Group>

            <Button disabled={loading} className="w-100" type="submit">
              {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
            </Button>
          </Form>
          <div className="text-center mt-3">
            Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RegisterPage;
