import React from "react";
import { Modal, Card, Button, Form, Spinner, Alert } from "react-bootstrap";
import CustomerDto from "../../dtos/CustomerDto";

interface Props {
  show: boolean;
  isEdit: boolean;
  loading: boolean;
  customer: CustomerDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onClose: () => void;
  onSave: () => void;
  formError?: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    note?: string;
  };
}

const AddEditCustomerModal: React.FC<Props> = ({
  show,
  isEdit,
  loading,
  customer,
  onChange,
  onClose,
  onSave,
  formError,
}) => (
  <Modal show={show} onHide={onClose} centered>
    <Card className="shadow-sm m-0">
      <Card.Header>
        <h5 className="mb-0">{isEdit ? "Müşteri Güncelle" : "Yeni Müşteri Ekle"}</h5>
      </Card.Header>
      <Card.Body>
        {formError && Object.values(formError).some(Boolean) && (
          <Alert variant="danger" className="mb-3">
            {Object.values(formError)
              .filter(Boolean)
              .map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
          </Alert>
        )}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Ad Soyad</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={customer.name}
              onChange={onChange}
              required
              isInvalid={!!formError?.name}
              maxLength={100}
            />
            {formError?.name && (
              <Form.Control.Feedback type="invalid">
                {formError.name}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefon</Form.Label>
            <Form.Control
              type="text"
              name="phoneNumber"
              value={customer.phoneNumber}
              onChange={onChange}
              isInvalid={!!formError?.phone}
              maxLength={10}
            />
            {formError?.phone && (
              <Form.Control.Feedback type="invalid">
                {formError.phone}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>E-posta</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={customer.email}
              onChange={onChange}
              isInvalid={!!formError?.email}
              maxLength={255}
            />
            {formError?.email && (
              <Form.Control.Feedback type="invalid">
                {formError.email}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              as="textarea"
              name="address"
              value={customer.address}
              onChange={onChange}
              rows={4}
              isInvalid={!!formError?.address}
              maxLength={1000}
            />
            {formError?.address && (
              <Form.Control.Feedback type="invalid">
                {formError.address}
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Not</Form.Label>
            <Form.Control
              as="textarea"
              name="note"
              value={customer.note}
              onChange={onChange}
              rows={2}
              isInvalid={!!formError?.note}
              maxLength={255}
            />
            {formError?.note && (
              <Form.Control.Feedback type="invalid">
                {formError.note}
              </Form.Control.Feedback>
            )}
          </Form.Group>
        </Form>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Vazgeç
        </Button>
        <Button variant="primary" onClick={onSave} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Kaydet"}
        </Button>
      </Card.Footer>
    </Card>
  </Modal>
);

export default AddEditCustomerModal;