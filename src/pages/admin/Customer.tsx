import { faUsers, faEdit, faTrash, faUser, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Modal, Form, InputGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import CustomerService from '../../services/CustomerService';
import CustomerDTO from '../../services/CustomerDTO';

const emptyCustomer: CustomerDTO = {
  id: 0,
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  note: '',
  communicationPreference: 'NONE',
};

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerDTO[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState<CustomerDTO>(emptyCustomer);
  const [isEdit, setIsEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [detailCustomer, setDetailCustomer] = useState<CustomerDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      // handle error (show toast, etc.)
    }
    setLoading(false);
  };

  const handleShowAddModal = () => {
    setModalCustomer(emptyCustomer);
    setIsEdit(false);
    setShowModal(true);
  };

  const filteredCustomers = customers.filter(customer =>
    (customer.name && customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.phoneNumber && customer.phoneNumber.includes(searchQuery)) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.address && customer.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (customer.note && customer.note.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleShowEditModal = (customer: CustomerDTO) => {
    setModalCustomer(customer);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalCustomer(emptyCustomer);
    setIsEdit(false);
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModalCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isEdit) {
        await CustomerService.updateCustomer(modalCustomer.id ?? 0, modalCustomer);
      } else {
        await CustomerService.createCustomer(modalCustomer);
      }
      await fetchCustomers();
      handleCloseModal();
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      setLoading(true);
      try {
        await CustomerService.deleteCustomer(deleteId);
        await fetchCustomers();
      } catch (err) {
        // handle error
      }
      setShowDelete(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleShowDetail = (customer: CustomerDTO) => {
    setDetailCustomer(customer);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailCustomer(null);
  };

  const totalPages = Math.ceil(filteredCustomers.length / pageSize);

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <Container className="py-4">
      <PageHeader title="Müşteriler" icon={faUsers} />
      <Row>
        <Col md={12}>
          <Row className="mb-3">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ad, telefon, e-posta, adres veya nota göre ara..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  // className="bg-light"
                />
                <Button variant="outline-secondary" onClick={fetchCustomers} disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Yenile'}
                </Button>
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex justify-content-end gap-2">
              <Button
                variant="success"
                onClick={handleShowAddModal}
                // className="d-flex align-items-center"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />
                + Ekle
              </Button>
            </Col>
          </Row>
        </Col>

        <Col md={12}>
          <Card className="mb-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Müşteri Listesi</h5>
              <small className="text-muted">
                Toplam: {filteredCustomers.length} kayıt
              </small>
            </Card.Header>
          </Card>
          <Row>
            <Col md={12}>
              <div className="table-responsive">
                <Table
                  hover
                  bordered
                  className="align-middle table-striped shadow-sm rounded"
                >
                  <thead className="table-light">
                    <tr>
                      <th>Sıra</th>
                      <th>Ad Soyad</th>
                      <th>Telefon</th>
                      <th>E-posta</th>
                      <th>Adres</th>
                      <th>Not</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <Spinner animation="border" size="sm" /> Yükleniyor...
                        </td>
                      </tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-muted py-4">
                          {searchQuery ? 'Arama kriterlerine uygun kayıt bulunamadı.' : 'Henüz müşteri eklenmemiş.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedCustomers.map((customer, index) => (
                        <tr key={customer.id}>
                          <td className="text-center">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td>
                            <div
                              // className="d-flex align-items-center customer-detail-link"
                              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                              onClick={() => handleShowDetail(customer)}
                            >
                              <span className="fw-semibold text-primary">{customer.name}</span>
                              <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-info" size="sm" />
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">{customer.phoneNumber}</span>
                          </td>
                          <td>
                            <span className="text-muted">{customer.email}</span>
                          </td>
                          <td>
                            <span className="text-muted">{customer.address}</span>
                          </td>
                          <td>
                            <span className="text-muted">{customer.note}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleShowDetail(customer)}
                                title="Detay"
                              >
                                <FontAwesomeIcon icon={faInfoCircle} />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleShowEditModal(customer)}
                                title="Düzenle"
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => customer.id !== undefined && handleDelete(customer.id)}
                                title="Sil"
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Row className="mt-3">
              <Col className="d-flex justify-content-between align-items-center">
                <div>
                  <Form.Select
                    size="sm"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    {[5, 10, 20, 50].map(size => (
                      <option key={size} value={size}>
                        {size} kayıt
                      </option>
                    ))}
                  </Form.Select>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </Button>
                  <span>
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">{isEdit ? 'Müşteri Güncelle' : 'Yeni Müşteri Ekle'}</h5>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Ad Soyad</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={modalCustomer.name}
                  onChange={handleModalChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefon</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={modalCustomer.phoneNumber}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>E-posta</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={modalCustomer.email}
                  onChange={handleModalChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Adres</Form.Label>
                <Form.Control
                  as="textarea"
                  name="address"
                  value={modalCustomer.address}
                  onChange={handleModalChange}
                  rows={4}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Not</Form.Label>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={modalCustomer.note}
                  onChange={handleModalChange}
                  rows={2}
                />
              </Form.Group>
            </Form>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCloseModal}>
              Vazgeç
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Kaydet"}
            </Button>
          </Card.Footer>
        </Card>
      </Modal>

      {/* Detail Modal */}
      <Modal show={showDetail} onHide={handleCloseDetail} centered>
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
              Müşteri Detayı
            </h5>
          </Card.Header>
          <Card.Body>
            {detailCustomer && (
              <div>
                <Row className="mb-2">
                  <Col xs={4} className="fw-bold">Ad Soyad:</Col>
                  <Col xs={8}>{detailCustomer.name}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="fw-bold">Telefon:</Col>
                  <Col xs={8}>{detailCustomer.phoneNumber}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="fw-bold">E-posta:</Col>
                  <Col xs={8}>{detailCustomer.email}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="fw-bold">Adres:</Col>
                  <Col xs={8}>{detailCustomer.address}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4} className="fw-bold">Not:</Col>
                  <Col xs={8}>{detailCustomer.note}</Col>
                </Row>
              </div>
            )}
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseDetail}>
              Kapat
            </Button>
          </Card.Footer>
        </Card>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Müşteri Sil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bu müşteriyi silmek istediğinize emin misiniz?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Vazgeç
          </Button>
          <Button variant="danger" onClick={confirmDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Sil"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerPage;