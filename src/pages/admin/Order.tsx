import { faShoppingCart, faPlay, faStop, faCheck, faUndo, faChevronRight, faChevronLeft, faInfoCircle, faFilter, faTimes, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState, useMemo } from 'react';
import { Table, Card, Button, Form, InputGroup, Container, Row, Col, Spinner, Modal, Alert, Badge, Nav, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import { useOrderService } from '../../services/OrderService';
import { OrderSearchRequest, Order, OrderDetail, OrderStatus } from '../../dtos/OrderDto';
import '../../assets/styles/flow.css';
import StageFlow from '../../components/StageFlow';
import { useTaskService } from '../../services/TaskService';
import { ErrorMessage } from '../../utils/ErrorMessage';


interface ExtendedOrder extends Order {
  customerName?: string;
  taskName?: string;
  currentTaskStageName?: string | null;
}

interface ColumnFilter {
  status: string[];
  customerName: string;
  taskName: string;
  currentStage: string;
}

const OrderPage: React.FC = () => {
  const {
    searchOrders,
    startOrder,
    cancelOrder,
    completeOrder,
    revertOrder,
    moveToNextStage,
    moveToPreviousStage,
    getOrderById
  } = useOrderService();
  const { getTaskById } = useTaskService();

  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [showDetail, setShowDetail] = useState(false);
  const [detailOrder, setDetailOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'passive'>('active');
  const [columnFilters, setColumnFilters] = useState<ColumnFilter>({
    status: [],
    customerName: '',
    taskName: '',
    currentStage: ''
  });

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const searchRequest: OrderSearchRequest = {
        page: currentPage - 1,
        pageSize: pageSize
      };

      const result = await searchOrders(searchRequest);
      const ordersTemp: ExtendedOrder[] = result.content.map(detail => ({
        id: detail.id,
        userId: detail.userId,
        customerId: detail.customer.id,
        taskId: detail.task.id,
        taskCurrentStageId: detail.currentTaskStage?.id ?? null,
        status: detail.status,
        hasNextStage: detail.hasNextStage,
        token: '',
        createdDate: detail.createdDate,
        updatedDate: detail.updatedDate,
        customerName: detail.customer.name,
        taskName: detail.task.name,
        currentTaskStageName: detail.currentTaskStage?.name ?? null
      }));

      setOrders(ordersTemp || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(ErrorMessage.get(err));
    }
    setLoading(false);
  };

  const { activeOrders, passiveOrders } = useMemo(() => {
    const active = orders.filter(order =>
      order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED
    );
    const passive = orders.filter(order =>
      order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED
    );
    return { activeOrders: active, passiveOrders: passive };
  }, [orders]);

  const currentTabOrders = activeTab === 'active' ? activeOrders : passiveOrders;

  const filteredOrders = useMemo(() => {
    return currentTabOrders.filter(order => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = (
          order.id.toString().includes(query) ||
          order.customerName?.toLowerCase().includes(query) ||
          order.taskName?.toLowerCase().includes(query) ||
          order.customerId.toString().includes(query) ||
          order.taskId.toString().includes(query)
        );
        if (!matchesSearch) return false;
      }

      if (columnFilters.status.length > 0) {
        if (!columnFilters.status.includes(order.status)) return false;
      }

      if (columnFilters.customerName) {
        const customerName = order.customerName?.toLowerCase() || '';
        if (!customerName.includes(columnFilters.customerName.toLowerCase())) return false;
      }

      if (columnFilters.taskName) {
        const taskName = order.taskName?.toLowerCase() || '';
        if (!taskName.includes(columnFilters.taskName.toLowerCase())) return false;
      }

      if (columnFilters.currentStage) {
        const stageName = order.currentTaskStageName?.toLowerCase() || '';
        if (!stageName.includes(columnFilters.currentStage.toLowerCase())) return false;
      }

      return true;
    });
  }, [currentTabOrders, searchQuery, columnFilters]);

  const totalFilteredPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(currentTabOrders.map(order => order.status)));
  }, [currentTabOrders]);

  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(currentTabOrders.map(order => order.customerName).filter(Boolean)));
  }, [currentTabOrders]);

  const uniqueTasks = useMemo(() => {
    return Array.from(new Set(currentTabOrders.map(order => order.taskName).filter(Boolean)));
  }, [currentTabOrders]);

  const uniqueStages = useMemo(() => {
    return Array.from(new Set(currentTabOrders.map(order => order.currentTaskStageName).filter(Boolean)));
  }, [currentTabOrders]);


  const handleAction = async (orderId: number, action: string, actionFunction: (id: number) => Promise<void>) => {
    setActionLoading(orderId);
    setError('');
    setSuccess('');

    try {
      await actionFunction(orderId);
      setSuccess(`Sipariş ${action} işlemi başarıyla tamamlandı!`);
      await fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(`Error ${action} order:`, err);
      setError(ErrorMessage.get(err));
    }
    setActionLoading(null);
  };

  const handleShowDetail = async (order: ExtendedOrder) => {
    setLoading(true);
    try {
      const orderDetail = await getOrderById(order.id);
      setDetailOrder(orderDetail);

      const taskDetail = await getTaskById(orderDetail.task.id) as { stages?: any[] };
      orderDetail.taskStages = taskDetail.stages || [];

      setShowDetail(true);
    } catch (err) {
      console.error('Error fetching order detail:', err);
      setError(ErrorMessage.get(err));
    }
    setLoading(false);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailOrder(null);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CREATED:
        return <Badge bg="warning">Oluşturuldu</Badge>;
      case OrderStatus.IN_PROGRESS:
        return <Badge bg="info">Devam Ediyor</Badge>;
      case OrderStatus.COMPLETED:
        return <Badge bg="success">Tamamlandı</Badge>;
      case OrderStatus.CANCELLED:
        return <Badge bg="danger">İptal Edildi</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const getCurrentStage = (order: ExtendedOrder) => {
    return order.currentTaskStageName ? order.currentTaskStageName : 'Aşama belirlenmemiş';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    setColumnFilters({
      status: [],
      customerName: '',
      taskName: '',
      currentStage: ''
    });
    fetchOrders();
  };

  const handleTabChange = (tab: 'active' | 'passive') => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchQuery('');
    setColumnFilters({
      status: [],
      customerName: '',
      taskName: '',
      currentStage: ''
    });
  };

  const handleColumnFilterChange = (column: keyof ColumnFilter, value: any) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
    setCurrentPage(1);
  };

  const clearColumnFilter = (column: keyof ColumnFilter) => {
    if (column === 'status') {
      handleColumnFilterChange(column, []);
    } else {
      handleColumnFilterChange(column, '');
    }
  };

  const isActionDisabled = (orderId: number) => {
    return actionLoading === orderId || loading;
  };

  // Buton durumlarını kontrol eden fonksiyonlar
  const canStart = (order: ExtendedOrder) => {
    return order.status === OrderStatus.CREATED;
  };

  const canMoveToNext = (order: ExtendedOrder) => {
    return order.status === OrderStatus.IN_PROGRESS && order.hasNextStage;
  };

  const canMoveToPrevious = (order: ExtendedOrder) => {
    return order.status === OrderStatus.IN_PROGRESS && order.taskCurrentStageId !== null;
  };

  const canComplete = (order: ExtendedOrder) => {
    return order.status === OrderStatus.IN_PROGRESS && !order.hasNextStage;
  };

  const canCancel = (order: ExtendedOrder) => {
    return order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.COMPLETED;
  };

  const canRevert = (order: ExtendedOrder) => {
    return order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.COMPLETED;
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

  return (
    <Container className="py-4">
      <PageHeader title="Siparişler" icon={faShoppingCart} />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      <Row>
        <Col md={12}>
          <Row className="mb-3">
            <Col md={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Sipariş ID, müşteri adı, iş akışı adı ile ara..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-secondary" onClick={handleRefresh} disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Yenile'}
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Col>

        <Col md={12}>
          <Card className="mb-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                {activeTab === 'active' ? 'Aktif' : 'Pasif'} Sipariş Listesi
              </h5>
              <small className="text-muted">
                Toplam: {filteredOrders.length} kayıt
              </small>
            </Card.Header>
          </Card>

          {/* Column Filters */}
          <Card className="mb-3">
            <Card.Body className="p-3">
              <Row className="g-2">
                <Col md={2}>
                  <Form.Label className="small fw-bold">Durum Filtresi</Form.Label>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100">
                      <FontAwesomeIcon icon={faFilter} className="me-1" />
                      {columnFilters.status.length > 0 ? `${columnFilters.status.length} seçili` : 'Tümü'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {uniqueStatuses.map(status => (
                        <Dropdown.Item
                          key={status}
                          onClick={() => {
                            const newStatuses = columnFilters.status.includes(status)
                              ? columnFilters.status.filter(s => s !== status)
                              : [...columnFilters.status, status];
                            handleColumnFilterChange('status', newStatuses);
                          }}
                        >
                          <Form.Check
                            type="checkbox"
                            checked={columnFilters.status.includes(status)}
                            onChange={() => { }}
                            label={status}
                          />
                        </Dropdown.Item>
                      ))}
                      {columnFilters.status.length > 0 && (
                        <>
                          <Dropdown.Divider />
                          <Dropdown.Item onClick={() => clearColumnFilter('status')}>
                            <FontAwesomeIcon icon={faTimes} className="me-1" />
                            Temizle
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col md={2}>
                  <Form.Label className="small fw-bold">Müşteri Filtresi</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      type="text"
                      placeholder="Müşteri ara..."
                      value={columnFilters.customerName}
                      onChange={(e) => handleColumnFilterChange('customerName', e.target.value)}
                    />
                    {columnFilters.customerName && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => clearColumnFilter('customerName')}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                <Col md={2}>
                  <Form.Label className="small fw-bold">İş Akışı Filtresi</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      type="text"
                      placeholder="İş akışı ara..."
                      value={columnFilters.taskName}
                      onChange={(e) => handleColumnFilterChange('taskName', e.target.value)}
                    />
                    {columnFilters.taskName && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => clearColumnFilter('taskName')}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    )}
                  </InputGroup>
                </Col>

                <Col md={2}>
                  <Form.Label className="small fw-bold">Aşama Filtresi</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      type="text"
                      placeholder="Aşama ara..."
                      value={columnFilters.currentStage}
                      onChange={(e) => handleColumnFilterChange('currentStage', e.target.value)}
                    />
                    {columnFilters.currentStage && (
                      <Button
                        variant="outline-secondary"
                        onClick={() => clearColumnFilter('currentStage')}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </Button>
                    )}
                  </InputGroup>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Row>
            <Col md={12}>
              <Card className="mb-1">
                <Card.Body className="p-2">
                  <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => handleTabChange(k as 'active' | 'passive')}>
                    <Nav.Item>
                      <Nav.Link eventKey="active">
                        Aktif Siparişler <Badge bg="primary" className="ms-1">{activeOrders.length}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="passive">
                        Pasif Siparişler <Badge bg="secondary" className="ms-1">{passiveOrders.length}</Badge>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Body>
              </Card>
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
                      <th>Durum</th>
                      <th>Müşteri Adı</th>
                      <th>İş Akışı Adı</th>
                      <th>Şuanki Aşama</th>
                      <th>Oluşturulma Tarihi</th>
                      <th>Güncellenme Tarihi</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="text-center py-4">
                          <Spinner animation="border" size="sm" /> Yükleniyor...
                        </td>
                      </tr>
                    ) : paginatedOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center text-muted py-4">
                          {searchQuery || Object.values(columnFilters).some(f => Array.isArray(f) ? f.length > 0 : f)
                            ? 'Filtreleme kriterlerine uygun sipariş bulunamadı.'
                            : `${activeTab === 'active' ? 'Aktif' : 'Pasif'} sipariş bulunmamaktadır.`}
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order, index) => (
                        <tr key={order.id}>
                          <td className="text-center">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td>
                            {getStatusBadge(order.status)}
                          </td>
                          <td>
                            <div
                              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                              onClick={() => handleShowDetail(order)}
                            >
                              <span className="fw-semibold text-primary">
                                {order.customerName || `Müşteri ID: ${order.customerId}`}
                              </span>
                              <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-info" size="sm" />
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">
                              {order.taskName || `İş Akışı ID: ${order.taskId}`}
                            </span>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark border">
                              {getCurrentStage(order)}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(order.createdDate)}
                            </small>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(order.updatedDate)}
                            </small>
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center flex-wrap">
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleShowDetail(order)}
                                title="Detay"
                                disabled={isActionDisabled(order.id)}
                              >
                                <FontAwesomeIcon icon={faInfoCircle} />
                              </Button>

                              <Link
                                to={`/monitor/${order.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  title="Monitör Sayfasını Aç"
                                >
                                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                                </Button>
                              </Link>

                              {activeTab === 'active' && (
                                <>
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'başlatma', startOrder)}
                                    title="Başlat"
                                    disabled={isActionDisabled(order.id) || !canStart(order)}
                                  >
                                    {actionLoading === order.id ? <Spinner size="sm" animation="border" /> : <FontAwesomeIcon icon={faPlay} />}
                                  </Button>

                                  <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'sonraki aşamaya geçme', moveToNextStage)}
                                    title="Sonraki Aşama"
                                    disabled={isActionDisabled(order.id) || !canMoveToNext(order)}
                                  >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                  </Button>

                                  <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'önceki aşamaya geçme', moveToPreviousStage)}
                                    title="Önceki Aşama"
                                    disabled={isActionDisabled(order.id) || !canMoveToPrevious(order)}
                                  >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                  </Button>

                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'geri alma', revertOrder)}
                                    title="Geri Al"
                                    disabled={isActionDisabled(order.id) || !canRevert(order)}
                                  >
                                    <FontAwesomeIcon icon={faUndo} />
                                  </Button>

                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'tamamlama', completeOrder)}
                                    title="Tamamla"
                                    disabled={isActionDisabled(order.id) || !canComplete(order)}
                                  >
                                    <FontAwesomeIcon icon={faCheck} />
                                  </Button>

                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleAction(order.id, 'iptal etme', cancelOrder)}
                                    title="İptal Et"
                                    disabled={isActionDisabled(order.id) || !canCancel(order)}
                                  >
                                    <FontAwesomeIcon icon={faStop} />
                                  </Button>
                                </>
                              )}
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
          {totalFilteredPages > 1 && (
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
                    {currentPage} / {totalFilteredPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    disabled={currentPage === totalFilteredPages}
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

      <Modal show={showDetail} onHide={handleCloseDetail} centered size="lg">
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">Sipariş Detayı</h5>
          </Card.Header>
          <Card.Body>
            {detailOrder && (
              <>
                <h5 className="mb-3">Sipariş #{detailOrder.id}</h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Sipariş ID</th>
                      <td>{detailOrder.id}</td>
                    </tr>
                    <tr>
                      <th>Müşteri</th>
                      <td>{detailOrder.customer.name}</td>
                    </tr>
                    <tr>
                      <th>İş Akışı</th>
                      <td>{detailOrder.task.name}</td>
                    </tr>
                    <tr>
                      <th>Durum</th>
                      <td>{getStatusBadge(detailOrder.status)}</td>
                    </tr>
                    <tr>
                      <th>Mevcut Aşama</th>
                      <td>
                        {detailOrder.currentTaskStage ? (
                          <span className="badge bg-warning text-dark">
                            {detailOrder.currentTaskStage.name}
                          </span>
                        ) : (
                          <span className="text-muted">Aşama belirlenmemiş</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th>Sonraki Aşama Var mı?</th>
                      <td>
                        <Badge bg={detailOrder.hasNextStage ? "success" : "secondary"}>
                          {detailOrder.hasNextStage ? "Evet" : "Hayır"}
                        </Badge>
                      </td>
                    </tr>
                    <tr>
                      <th>Oluşturulma Tarihi</th>
                      <td>{formatDate(detailOrder.createdDate)}</td>
                    </tr>
                    <tr>
                      <th>Güncellenme Tarihi</th>
                      <td>{formatDate(detailOrder.updatedDate)}</td>
                    </tr>
                  </tbody>
                </table>

                <p><strong>İş Akışı Durumu:</strong></p>
                <div className="alert alert-info">
                  <strong>{detailOrder.task.name}</strong> iş akışında
                  {detailOrder.currentTaskStage ? (
                    <span> <strong>{detailOrder.currentTaskStage.name}</strong> aşamasındasınız.</span>
                  ) : (
                    <span> henüz bir aşamada değilsiniz.</span>
                  )}
                  {detailOrder.hasNextStage && (
                    <div className="mt-2">
                      <small className="text-muted">Sonraki aşamaya geçilebilir.</small>
                    </div>
                  )}
                </div>
                <StageFlow
                  stages={detailOrder.taskStages}
                  currentStageId={detailOrder.currentTaskStage?.id}
                ></StageFlow>
              </>
            )}
          </Card.Body>

          <Card.Footer className="d-flex justify-content-between">
            <Link
              to={`/monitor/${detailOrder?.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline-primary">
                <FontAwesomeIcon icon={faExternalLinkAlt} className="me-2" />
                Monitör Sayfasını Aç
              </Button>
            </Link>
            <Button variant="secondary" onClick={handleCloseDetail}>
              Kapat
            </Button>
          </Card.Footer>
        </Card>
      </Modal>
    </Container>
  );
};

export default OrderPage;