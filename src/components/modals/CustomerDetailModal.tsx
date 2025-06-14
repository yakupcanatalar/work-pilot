import React from "react";
import { Modal, Card, Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import CustomerDTO from "../../dtos/CustomerDTO";

interface Props {
  show: boolean;
  customer: CustomerDTO | null;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<Props> = ({ show, customer, onClose }) => (
  <Modal show={show} onHide={onClose} centered>
    <Card className="shadow-sm m-0">
      <Card.Header>
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
          Müşteri Detayı
        </h5>
      </Card.Header>
      <Card.Body>
        {customer && (
          <div>
            <Row className="mb-2">
              <Col xs={4} className="fw-bold">Ad Soyad:</Col>
              <Col xs={8}>{customer.name}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="fw-bold">Telefon:</Col>
              <Col xs={8}>{customer.phoneNumber}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="fw-bold">E-posta:</Col>
              <Col xs={8}>{customer.email}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="fw-bold">Adres:</Col>
              <Col xs={8}>{customer.address}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={4} className="fw-bold">Not:</Col>
              <Col xs={8}>{customer.note}</Col>
            </Row>
          </div>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Button variant="secondary" onClick={onClose}>
          Kapat
        </Button>
      </Card.Footer>
    </Card>
  </Modal>
);

export default CustomerDetailModal;