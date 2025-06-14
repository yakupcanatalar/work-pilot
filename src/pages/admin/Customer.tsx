import { faUsers, faEdit, faTrash, faUser, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Form, InputGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import CustomerService from '../../services/CustomerService';
import CustomerDTO from '../../dtos/CustomerDTO';
import AddEditCustomerModal from '../../components/modals/AddEditCustomerModal';
import CustomerDetailModal from '../../components/modals/CustomerDetailModal';
import DeleteCustomerModal from '../../components/modals/DeleteCustomerModal';

const CUSTOMER_NAME_MAX_LENGTH = 100;
const CUSTOMER_NAME_MIN_LENGTH = 2;
const CUSTOMER_PHONE_NUMBER_LENGTH = 10;
const CUSTOMER_EMAIL_MAX_LENGTH = 255;
const CUSTOMER_ADDRESS_MAX_LENGTH = 1000;
const CUSTOMER_NOTE_MAX_LENGTH = 255;

const emptyCustomer: CustomerDTO = {
  id: 0,
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  note: '',
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
  const [formError, setFormError] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
  }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await CustomerService.getAllCustomers();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
    setLoading(false);
  };

  const handleShowAddModal = () => {
    setModalCustomer(emptyCustomer);
    setIsEdit(false);
    setShowModal(true);
    setFormError({});
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
    setFormError({});
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalCustomer(emptyCustomer);
    setIsEdit(false);
    setFormError({});
  };

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setModalCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let error: {
      name?: string;
      phone?: string;
      email?: string;
      address?: string;
      note?: string;
    } = {};

    // Ad Soyad kontrolü
    if (
      !modalCustomer.name ||
      modalCustomer.name.length < CUSTOMER_NAME_MIN_LENGTH ||
      modalCustomer.name.length > CUSTOMER_NAME_MAX_LENGTH
    ) {
      error.name = `Ad Soyad ${CUSTOMER_NAME_MIN_LENGTH}-${CUSTOMER_NAME_MAX_LENGTH} karakter olmalı.`;
    }

    if (
      !/^[1-9][0-9]{9}$/.test(modalCustomer.phoneNumber) ||
      modalCustomer.phoneNumber.length !== CUSTOMER_PHONE_NUMBER_LENGTH
    ) {
      error.phone = "Telefon numarası 0 ile başlamamalı ve 10 haneli olmalı.";
    }

    if (modalCustomer.email) {
      if (
        modalCustomer.email.length > CUSTOMER_EMAIL_MAX_LENGTH
      ) {
        error.email = `E-posta en fazla ${CUSTOMER_EMAIL_MAX_LENGTH} karakter olmalı.`;
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(modalCustomer.email)
      ) {
        error.email = "Geçerli bir e-posta adresi giriniz.";
      }
    }

    if (modalCustomer.address && modalCustomer.address.length > CUSTOMER_ADDRESS_MAX_LENGTH) {
      error.address = `Adres en fazla ${CUSTOMER_ADDRESS_MAX_LENGTH} karakter olmalı.`;
    }

    if (modalCustomer.note && modalCustomer.note.length > CUSTOMER_NOTE_MAX_LENGTH) {
      error.note = `Not en fazla ${CUSTOMER_NOTE_MAX_LENGTH} karakter olmalı.`;
    }

    setFormError(error);
    return Object.keys(error).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
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
      console.error('Error saving customer:', err);
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
              <div
                className="table-responsive"
                style={{ maxHeight: 700, overflowY: 'auto' }}
              >
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
              <Col className="d-flex justify-content-center align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
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
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <FontAwesomeIcon icon={faChevronRight} />
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <AddEditCustomerModal
        show={showModal}
        isEdit={isEdit}
        loading={loading}
        customer={modalCustomer}
        onChange={handleModalChange}
        onClose={handleCloseModal}
        onSave={handleSave}
        formError={formError}
      />

      <CustomerDetailModal
        show={showDetail}
        customer={detailCustomer}
        onClose={handleCloseDetail}
      />

      <DeleteCustomerModal
        show={showDelete}
        loading={loading}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </Container>
  );
};

export default CustomerPage;