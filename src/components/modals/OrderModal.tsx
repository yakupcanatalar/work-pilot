import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Form, Spinner, Alert, Nav, Tab, Table, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faTasks, faCheckCircle, faList, faPhone, faEnvelope, faCircle, faMapMarkerAlt, faStickyNote } from '@fortawesome/free-solid-svg-icons';
import { getTasks } from '../../services/TaskService';
import { searchOrders, createOrder } from '../../services/OrderService';
import CustomerDto from '../../dtos/CustomerDto';
import { OrderDetail, OrderSearchRequest, OrderStatus, CreateOrderRequest } from '../../dtos/OrderDto';
import { faFirstOrder } from '@fortawesome/free-brands-svg-icons';

interface Task {
  id: number;
  name: string;
  note: string;
  nodes?: any;
  stageIds: number[];
}

interface OrderModalProps {
  show: boolean;
  customer: CustomerDto | null;
  onClose: () => void;
  onOrderCreated?: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  show,
  customer,
  onClose,
  onOrderCreated
}) => {
  const [activeTab, setActiveTab] = useState<string>('new-order');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string>('');

  useEffect(() => {
    if (show) {
      if (activeTab === 'new-order') {
        fetchTasks();
      } else if (activeTab === 'order-list') {
        fetchOrders();
      }
    }
  }, [show, activeTab]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Görevler yüklenirken hata oluştu.');
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    if (!customer?.id) return;

    setOrdersLoading(true);
    setOrdersError('');
    try {
      const searchParams: OrderSearchRequest = {
        customerId: customer.id,
        page: 0,
        pageSize: 50
      };
      const pageResult = await searchOrders(searchParams);

      const sortedOrders = pageResult.content.sort((a: OrderDetail, b: OrderDetail) =>
        b.createdDate - a.createdDate
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError('Siparişler yüklenirken hata oluştu.');
    }
    setOrdersLoading(false);
  };

  const handleTaskSelect = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleSaveOrder = async () => {
    if (!selectedTaskId || !customer?.id) {
      setError('Lütfen bir görev seçin.');
      return;
    }

    setCreating(true);
    setError('');

    try {
      const selectedTask = tasks.find(task => task.id === selectedTaskId);
      if (!selectedTask) {
        setError('Seçilen görev bulunamadı.');
        return;
      }

      const orderData: CreateOrderRequest = {
        customerId: customer.id,
        taskId: selectedTaskId,
      };

      await createOrder(orderData);

      handleClose();
      if (onOrderCreated) {
        onOrderCreated();
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Sipariş oluşturulurken hata oluştu.');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setSelectedTaskId(null);
    setError('');
    setOrdersError('');
    setActiveTab('new-order');
    onClose();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.CREATED:
        return 'Oluşturuldu';
      case OrderStatus.IN_PROGRESS:
        return 'Devam Ediyor';
      case OrderStatus.COMPLETED:
        return 'Tamamlandı';
      case OrderStatus.CANCELLED:
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  const getStatusBadgeClass = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'success';
      case OrderStatus.IN_PROGRESS:
        return 'warning';
      case OrderStatus.CREATED:
        return 'info';
      case OrderStatus.CANCELLED:
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Card className="shadow-sm m-0">
        <Card.Header>
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
            Sipariş Yönetimi
          </h5>
        </Card.Header>

        <Card.Body className="p-0">
          {customer && (
            <div className="p-3 bg-light border-bottom">
              <div><strong><h4>{customer.name}</h4></strong></div>
              <div className="d-flex flex-wrap gap-3 mt-2">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faPhone} className="text-success me-2" />
                  <span>{customer.phoneNumber}</span>
                </div>
                {customer.email && (
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="text-info me-2" />
                    <span>{customer.email}</span>
                  </div>
                )}
              </div>
              {customer.address && (
                <div className="d-flex align-items-start mt-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-warning me-2 mt-1" />
                  <small className="text-muted">{customer.address}</small>
                </div>
              )}
            </div>
          )}

          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'new-order')}>
            <Nav variant="tabs" className="px-3">
              <Nav.Item>
                <Nav.Link eventKey="new-order">
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Yeni Sipariş
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="order-list">
                  <FontAwesomeIcon icon={faList} className="me-2" />
                  Sipariş Geçmişi
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content className="p-3">
              <Tab.Pane eventKey="new-order">
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}

                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Görev Seçin
                    </Form.Label>
                    {loading ? (
                      <div className="text-center py-4">
                        <Spinner animation="border" size="sm" /> Görevler yükleniyor...
                      </div>
                    ) : tasks.length === 0 ? (
                      <div className="text-center text-muted py-4 border rounded">
                        Henüz görev tanımlanmamış.
                      </div>
                    ) : (
                      <div className="border rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {tasks.map((task, index) => (
                          <div
                            key={task.id}
                            className={`p-3 ${index < tasks.length - 1 ? 'border-bottom' : ''} ${selectedTaskId === task.id
                                ? 'bg-primary bg-opacity-10'
                                : 'bg-white'
                              }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            <Form.Check
                              type="radio"
                              id={`task-${task.id}`}
                              name="selectedTask"
                              checked={selectedTaskId === task.id}
                              onChange={() => handleTaskSelect(task.id)}
                              className="d-none"
                            />
                            <div className="d-flex align-items-start">
                              <div className="me-3 mt-1">
                                {selectedTaskId === task.id ? (
                                  <FontAwesomeIcon icon={faCheckCircle} className="text-primary" />
                                ) : (
                                  <div
                                    className="rounded-circle border border-secondary bg-white"
                                    style={{ width: '16px', height: '16px' }}
                                  ></div>
                                )}
                              </div>
                              <div className="flex-grow-1">
                                <strong className={selectedTaskId === task.id ? 'text-primary' : ''}>
                                  {task.name}
                                </strong>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    )}
                  </Form.Group>
                </Form>
              </Tab.Pane>

              <Tab.Pane eventKey="order-list">
                {ordersError && (
                  <Alert variant="danger" className="mb-4 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCircle} className="me-2" />
                    {ordersError}
                  </Alert>
                )}

                {ordersLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <div className="mt-2 text-muted">Siparişler yükleniyor...</div>
                  </div>
                ) : orders.length === 0 ? (
                  <Card className="text-center py-5 bg-light border-2 border-dashed">
                    <Card.Body>
                      <FontAwesomeIcon icon={faList} className="text-muted mb-3" size="2x" />
                      <h6 className="text-muted">Bu müşteriye ait sipariş bulunamadı</h6>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="border rounded-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <Table hover className="mb-0">
                      <thead className="table-light sticky-top">
                        <tr>
                          <th className="fw-bold">Sipariş</th>
                          <th className="fw-bold">Görev</th>
                          <th className="fw-bold">Mevcut Aşama</th>
                          <th className="fw-bold">Tarih</th>
                          <th className="fw-bold">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td>
                              <span className="fw-bold text-primary">{order.id}</span>
                            </td>
                            <td>
                              <div className="fw-medium">{order.task.name}</div>
                            </td>
                            <td>
                              {order.currentTaskStage ? (
                                <Badge bg="secondary" className="fw-normal">
                                  {order.currentTaskStage.name}
                                </Badge>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <small className="text-muted">
                                {formatDate(order.createdDate)}
                              </small>
                            </td>
                            <td>
                              <Badge bg={getStatusBadgeClass(order.status)} className="fw-normal">
                                {getStatusText(order.status)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>

        <Card.Footer className="bg-white border-top-0 p-4">
          <div className="d-flex justify-content-end gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleClose}
              disabled={creating}
              size="sm"
            >
              {activeTab === 'new-order' ? 'Vazgeç' : 'Kapat'}
            </Button>
            {activeTab === 'new-order' && (
              <Button
                variant="primary"
                onClick={handleSaveOrder}
                disabled={!selectedTaskId || creating || loading}
                size="sm"
                className="px-4"
              >
                {creating ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                    Sipariş Oluştur
                  </>
                )}
              </Button>
            )}
          </div>
        </Card.Footer>
      </Card>
    </Modal>
  );
};

export default OrderModal;