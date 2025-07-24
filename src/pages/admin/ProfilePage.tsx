import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { faSave, faKey, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import { useProfileService } from '../../services/ProfileService';

interface ProfileState {
  firstname: string;
  lastname: string;
  email: string;
  companyName: string;
  phone?: string;
  address?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { getUserProfile, updateUserProfile, changePassword } = useProfileService();

  const [profile, setProfile] = useState<ProfileState>({
    firstname: '',
    lastname: '',
    email: '',
    companyName: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [profileUpdateLoading, setProfileUpdateLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setProfile(prevState => ({
          ...prevState,
          ...userData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } catch (error: any) {
        setAlert({
          type: 'danger',
          message: error?.message || 'Profil bilgileri yüklenirken hata oluştu'
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [getUserProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      setProfileUpdateLoading(true);
      setAlert(null);

      await updateUserProfile({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email,
        companyName: profile.companyName,
        phone: profile.phone,
        address: profile.address,
      });

      setAlert({
        type: 'success',
        message: 'Profil bilgileri başarıyla güncellendi'
      });
    } catch (error: any) {
      setAlert({
        type: 'danger',
        message: error?.message || 'Profil güncellenirken hata oluştu'
      });
    } finally {
      setProfileUpdateLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    try {
      setPasswordChangeLoading(true);
      setAlert(null);

      if (profile.newPassword !== profile.confirmPassword) {
        setAlert({
          type: 'danger',
          message: 'Yeni şifreler eşleşmiyor'
        });
        return;
      }

      await changePassword({
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword,
        confirmationPassword: profile.confirmPassword,
      });

      setProfile(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      setAlert({
        type: 'success',
        message: 'Şifre başarıyla değiştirildi'
      });
    } catch (error: any) {
      setAlert({
        type: 'danger',
        message: error?.message || 'Şifre değiştirilirken hata oluştu'
      });
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <PageHeader title="Profil Sayfası" icon={faUser} />

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

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
                    <Form.Control
                      type="text"
                      name="firstname"
                      value={profile.firstname}
                      onChange={handleChange}
                      disabled={profileUpdateLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastname"
                      value={profile.lastname}
                      onChange={handleChange}
                      disabled={profileUpdateLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Telefon</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      disabled={profileUpdateLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>E-posta</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={profileUpdateLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Şirket Adı</Form.Label>
                    <Form.Control
                      type="text"
                      name="companyName"
                      value={profile.companyName}
                      onChange={handleChange}
                      disabled={profileUpdateLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Adres</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="address"
                      value={profile.address || ''}
                      onChange={handleChange}
                      rows={3}
                      disabled={profileUpdateLoading}
                      style={{ resize: 'vertical', minHeight: 60 }}
                    />
                  </Form.Group>
                </Col>
                <Col md={6} className="d-flex justify-content-end align-items-end">
                  <Button
                    className='btn btn-success'
                    onClick={handleProfileUpdate}
                    disabled={profileUpdateLoading}
                  >
                    {profileUpdateLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Güncelleniyor...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} /> Bilgileri Güncelle
                      </>
                    )}
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
                    <Form.Control
                      type="password"
                      name="currentPassword"
                      value={profile.currentPassword}
                      onChange={handleChange}
                      disabled={passwordChangeLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Yeni Şifre</Form.Label>
                    <Form.Control
                      type="password"
                      name="newPassword"
                      value={profile.newPassword}
                      onChange={handleChange}
                      disabled={passwordChangeLoading}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Yeni Şifreyi Tekrarla</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={profile.confirmPassword}
                      onChange={handleChange}
                      disabled={passwordChangeLoading}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                className='btn btn-success'
                onClick={handlePasswordChange}
                disabled={passwordChangeLoading || !profile.currentPassword || !profile.newPassword || !profile.confirmPassword}
              >
                {passwordChangeLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Değiştiriliyor...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faKey} /> Şifreyi Değiştir
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile