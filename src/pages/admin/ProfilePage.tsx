import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { faSave, faHome, faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';


const Profile: React.FC = () => {
  const [profile, setProfile] = useState({
    firstName: 'Ali',
    lastName: 'Potasyum',
    phone: '1234567890',
    email: 'ali@example.com',
    address: 'Örnek Mahallesi, İstanbul',
    companyName: 'Atalar Tasarım & Yazılım A.Ş.',
    sector: 'Yazılım',
    description: 'Web Developer',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetch('/user/profile')
      .then(response => response.json())
      .then(data => setProfile(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileUpdate = () => {
    fetch('/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })
      .then(response => response.json());
  };

  const handlePasswordChange = () => {
    fetch('/user/password', {
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
    <div>
      <div>
        <PageHeader title="Profil Sayfası" icon={faUser} />
      </div>
           <Row>
              <Col md={12}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Kullanıcı Bilgileri</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ad</Form.Label>
                          <Form.Control type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Soyad</Form.Label>
                          <Form.Control type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Telefon</Form.Label>
                          <Form.Control type="text" name="phone" value={profile.phone} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>E-posta</Form.Label>
                          <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Adres</Form.Label>
                          <Form.Control type="text" name="address" value={profile.address} onChange={handleChange} />
                        </Form.Group>
                        </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5>Şirket Bilgileri</h5>
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Şirket Adı</Form.Label>
                          <Form.Control type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Şirket Telefon</Form.Label>
                          <Form.Control type="text" name="phone" value={profile.phone} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Şirket E-posta</Form.Label>
                          <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
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
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Firma Adresi</Form.Label>
                          <Form.Control type="text" name="address" value={profile.address} onChange={handleChange} />
                        </Form.Group>
                        </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                              <Card className="mb-4">
                    <Card.Header>
                    <h5>Şifre Bilgileri</h5>
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
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Button className="btn btn-success" onClick={handleProfileUpdate}>
                  <FontAwesomeIcon icon={faSave} className="me-2" /> Değişiklikleri Kaydet
                </Button>
              </Col>
              </Row>
    </div>
  );
};

export default Profile;
