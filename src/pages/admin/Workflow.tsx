import { faProjectDiagram, faEdit, faTrash, faPlus, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Form, InputGroup, Container, Row, Col, Spinner, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import { getTasks, createTask, updateTaskById, deleteTaskById } from '../../services/TaskService';
import { TaskStageDto } from '../../services/TaskStage';
import FlowBuilder from './FlowBuilder';
import Task from '../../services/Task';
import '../../assets/styles/flow.css';


const WorkflowPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('İş akışları yüklenirken hata oluştu.');
    }
    setLoading(false);
  };

  const filteredTasks = tasks.filter(task =>
    (task.name && task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.note && task.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.stages && task.stages.some(stage => stage.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleShowAddModal = () => {
    setEditingTask(null);
    setShowFlowBuilder(true);
  };

  const handleShowEditModal = (task: Task) => {
    setEditingTask(task);
    setShowFlowBuilder(true);
  };

  const handleSaveFlow = async (flowData: {
    name: string;
    note: string;
    stages: TaskStageDto[];
  }) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const taskData = {
        name: flowData.name,
        note: flowData.note,
        stageIds: flowData.stages.map(stage => stage.id!).filter(id => id !== undefined)
      };

      if (editingTask) {
        await updateTaskById(editingTask.id, taskData);
        setSuccess('İş akışı başarıyla güncellendi!');
      } else {
        await createTask(taskData);
        setSuccess('İş akışı başarıyla oluşturuldu!');
      }

      await fetchTasks();
      setShowFlowBuilder(false);
      setEditingTask(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving flow:', error);
      setError('İş akışı kaydedilirken hata oluştu!');
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
      setError('');
      setSuccess('');
      try {
        await deleteTaskById(deleteId);
        await fetchTasks();
        setSuccess('İş akışı başarıyla silindi!');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        console.error('Error deleting task:', err);
        setError('İş akışı silinirken hata oluştu!');
      }
      setShowDelete(false);
      setDeleteId(null);
      setLoading(false);
    }
  };

  const handleShowDetail = (task: Task) => {
    setDetailTask(task);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailTask(null);
  };

  const getFlowSummary = (task: Task) => {
    const stageCount = task.stages?.length || 0;
    return `${stageCount} aşama`;
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchTasks();
  };

  return (
    <Container className="py-4">
      <PageHeader title="İş Akışları" icon={faProjectDiagram} />

      {/* Alert Messages */}
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
                  placeholder="İş akışı adı, not veya aşama adına göre ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-light"
                />
                <Button variant="outline-secondary" onClick={handleRefresh} disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : 'Yenile'}
                </Button>
              </InputGroup>
            </Col>
            <Col md={4} className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-primary"
                onClick={handleRefresh}
                disabled={loading}
                title="Listeyi yenile"
              >
                <FontAwesomeIcon icon={faProjectDiagram} />
              </Button>
              <Button
                variant="primary"
                className="d-flex align-items-center"
                onClick={handleShowAddModal}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Yeni İş Akışı
              </Button>
            </Col>
          </Row>
        </Col>

        <Col md={12}>
          <Card className="mb-2">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">İş Akışı Listesi</h5>
              <small className="text-muted">
                Toplam: {filteredTasks.length} kayıt
              </small>
            </Card.Header>
          </Card>

          <Row>
            <Col md={12}>
              <div className="table-responsive">
                <Table hover bordered className="align-middle table-striped shadow-sm rounded">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '60px' }}>Sıra</th>
                      <th>İş Akışı Adı</th>
                      <th>Notlar</th>
                      <th>Akış Özeti</th>
                      <th>Aşamalar</th>
                      <th style={{ width: '140px' }}>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <Spinner animation="border" size="sm" className="me-2" />
                          Yükleniyor...
                        </td>
                      </tr>
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          {searchQuery ? 'Arama kriterlerine uygun kayıt bulunamadı.' : 'Henüz iş akışı oluşturulmamış.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task, index) => (
                        <tr key={task.id}>
                          <td className="text-center">
                            {(currentPage - 1) * pageSize + index + 1}
                          </td>
                          <td>
                            <span
                              style={{ color: '#0d6efd', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                              onClick={() => handleShowDetail(task)}
                            >
                              {task.name}
                              <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-info" size="sm" />
                            </span>
                          </td>
                          <td className="text-center">
                            <small className="text-muted">{task.note}</small>
                          </td>
                          <td>
                            <small className="text-muted">{getFlowSummary(task)}</small>
                          </td>
                          <td>
                            {task.stages && task.stages.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {task.stages.slice(0, 3).map(stage => (
                                  <span key={stage.id} className="badge bg-light text-dark border">
                                    {stage.name}
                                  </span>
                                ))}
                                {task.stages.length > 3 && (
                                  <span className="badge bg-secondary">
                                    +{task.stages.length - 3} daha
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                              <Button
                                variant="outline-info"
                                size="sm"
                                onClick={() => handleShowDetail(task)}
                                title="Detay"
                              >
                                <FontAwesomeIcon icon={faInfoCircle} />
                              </Button>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                onClick={() => handleShowEditModal(task)}
                                title="Düzenle"
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(task.id)}
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
                    style={{ width: 'auto', display: 'inline-block' }}
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

      {/* Flow Builder Modal */}
      <FlowBuilder
        show={showFlowBuilder}
        onHide={() => setShowFlowBuilder(false)}
        onSave={handleSaveFlow}
        task={editingTask}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">Silme Onayı</h5>
          </Card.Header>
          <Card.Body>
            Bu iş akışını silmek istediğinize emin misiniz?
          </Card.Body>
          <Card.Footer className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={() => setShowDelete(false)}>
              Vazgeç
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={loading}>
              {loading ? <Spinner size="sm" animation="border" /> : 'Sil'}
            </Button>
          </Card.Footer>
        </Card>
      </Modal>

      {/* Detail Modal */}
      <Modal show={showDetail} onHide={handleCloseDetail} centered size="lg">
        <Card className="shadow-sm m-0">
          <Card.Header>
            <h5 className="mb-0">İş Akışı Detayı</h5>
          </Card.Header>
          <Card.Body>
            {detailTask && (
              <>
                <h5 className="mb-3">{detailTask.name}</h5>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Kullanıcı ID</th>
                      <td>{detailTask.userId}</td>
                    </tr>
                    <tr>
                      <th>Not</th>
                      <td>{detailTask.note || '-'}</td>
                    </tr>
                    <tr>
                      <th>Akış Özeti</th>
                      <td>{getFlowSummary(detailTask)}</td>
                    </tr>
                  </tbody>
                </table>

                <p><strong>Aşamalar:</strong></p>
                {detailTask.stages && detailTask.stages.length > 0 ? (
                  <div className="stage-flow">
                    {detailTask.stages.map((stage, index) => (
                      <React.Fragment key={stage.id}>
                        <div className="stage-box">{stage.name}</div>
                        {index !== detailTask.stages.length - 1 && (
                          <div className="arrow">→</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">Aşama bulunmamaktadır.</p>
                )}
              </>
            )}
          </Card.Body>

          <Card.Footer className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleCloseDetail}>
              Kapat
            </Button>
          </Card.Footer>
        </Card>
      </Modal>
    </Container>
  );
};

export default WorkflowPage;