import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

interface Props {
  show: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCustomerModal: React.FC<Props> = ({ show, loading, onClose, onConfirm }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Müşteri Sil</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Bu müşteriyi silmek istediğinize emin misiniz?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Vazgeç
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "Sil"}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteCustomerModal;