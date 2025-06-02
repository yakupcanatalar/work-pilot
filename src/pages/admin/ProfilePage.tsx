import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { faSave, faHome, faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    id: 0,
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    companyName: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    sector: 'Yazılım',
  });

  useEffect(() => {
    fetch('/users/profile')
      .then(response => response.json())
      .then(data => setProfile({ ...profile, ...data }));
    // eslint-disable-next-line
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileUpdate = () => {
    fetch('/users/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
      .then(response => response.json());
  };

  const handlePasswordChange = () => {
    fetch('/users/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword,
        confirmPassword: profile.confirmPassword
      })
    })
      .then(response => response.json());
  };

  return (
    <Container className="py-4">
      <PageHeader title="Profil Sayfası" icon={faUser} />
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Kullanıcı Bilgileri</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Ad</Form.Label>
                    <Form.Control type="text" name="firstname" value={profile.firstname} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control type="text" name="lastname" value={profile.lastname} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control type="text" name="phone" value={profile.phone} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-posta</Form.Label>
                    <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Şirket Adı</Form.Label>
                    <Form.Control type="text" name="companyName" value={profile.companyName} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sektör</Form.Label>
                    <Form.Select name="sector" value={profile.sector} onChange={handleChange}>
                      <option value="Yazılım">Yazılım</option>
                      <option value="Finans">Finans</option>
                      <option value="Sağlık">Sağlık</option>
                      {/* Diğer sektörler */}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      rows={2}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-end">
                  <Button className='btn btn-success' onClick={handleProfileUpdate}>
                    <FontAwesomeIcon icon={faSave} /> Bilgileri Güncelle
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Şifre Bilgileri</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Mevcut Şifre</Form.Label>
                    <Form.Control type="password" name="currentPassword" value={profile.currentPassword} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Yeni Şifre</Form.Label>
                    <Form.Control type="password" name="newPassword" value={profile.newPassword} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Yeni Şifreyi Tekrarla</Form.Label>
                    <Form.Control type="password" name="confirmPassword" value={profile.confirmPassword} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Button className='btn btn-success' onClick={handlePasswordChange}>
                <FontAwesomeIcon icon={faKey} /> Şifreyi Değiştir
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;