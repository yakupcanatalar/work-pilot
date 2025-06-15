import { faProjectDiagram, faEdit, faTrash, faPlus, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Form, InputGroup, Container, Row, Col, Spinner, Modal, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import { getTasks, createTask, updateTaskById, deleteTaskById } from '../../services/TaskService';
import FlowBuilder from './FlowBuilder';
import StageFlow from '../../components/StageFlow'; // StageFlow komponentini import et
import '../../assets/styles/flow.css';
import TaskDto from '../../dtos/TaskDto';
import TaskStageDto, { TaskStageStatus } from '../../dtos/TaskStageDto';


const WorkflowPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);
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

  // Sadece ACTIVE durumundaki stage'leri filtrele
  const getActiveStages = (stages: TaskStageDto[] | undefined): TaskStageDto[] => {
    if (!stages) return [];
    return stages.filter(stage => stage.status === TaskStageStatus.ACTIVE);
  };

  const filteredTasks = tasks.filter(task => {
    const activeStages = getActiveStages(task.stages);
    return (
      (task.name && task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.note && task.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (activeStages && activeStages.some(stage => stage.name.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  });

  const totalPages = Math.ceil(filteredTasks.length / pageSize);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleShowAddModal = () => {
    setEditingTask(null);
    setShowFlowBuilder(true);
  };

  const handleShowEditModal = (task: TaskDto) => {
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
      const activeStages = flowData.stages.filter(stage => stage.status === TaskStageStatus.ACTIVE);
      
      const taskData = {
        name: flowData.name,
        note: flowData.note,
        stageIds: activeStages.map(stage => stage.id!).filter(id => id !== undefined)
      };

      if (editingTask && editingTask.id) {
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

  const handleShowDetail = (task: TaskDto) => {
    setDetailTask(task);
    setShowDetail(true);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailTask(null);
  };

  const getFlowSummary = (task: TaskDto) => {
    const activeStages = getActiveStages(task.stages);
    const stageCount = activeStages.length;
    return `${stageCount} aşama`;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setCurrentPage(1);
    fetchTasks();
  };

  return (
    <Container className="py-4">
      <PageHeader title="İş Akışları" icon={faProjectDiagram} />

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
                  onChange={handleSearchChange}
                />
                <Button variant="outline-secondary" onClick={handleRefresh} disabled={loading}>
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
                <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
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
                      <th>İş Akışı Adı</th>
                      <th>Notlar</th>
                      <th>Akış Özeti</th>
                      <th>Aşamalar</th>
                      <th>İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4">
                          <Spinner animation="border" size="sm" /> Yükleniyor...
                        </td>
                      </tr>
                    ) : filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          {searchQuery ? 'Arama kriterlerine uygun kayıt bulunamadı.' : 'Henüz iş akışı oluşturulmamış.'}
                        </td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task, index) => {
                        const activeStages = getActiveStages(task.stages);
                        return (
                          <tr key={task.id}>
                            <td className="text-center">
                              {(currentPage - 1) * pageSize + index + 1}
                            </td>
                            <td>
                            <div
                              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                              onClick={() => handleShowDetail(task)}
                            >
                              <span className="fw-semibold text-primary">{task.name}</span>
                              <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-info" size="sm" />
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">{task.note}</span>
                          </td>
                          <td>
                            <span className="text-muted">{getFlowSummary(task)}</span>
                          </td>
                          <td>
                            {activeStages.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {activeStages.slice(0, 3).map(stage => (
                                  <span key={stage.id} className="badge bg-light text-dark border">
                                    {stage.name}
                                  </span>
                                ))}
                                {activeStages.length > 3 && (
                                  <span className="badge bg-secondary">
                                    +{activeStages.length - 3} daha
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <div className="d-flex gap-1 justify-content-center">
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
                                onClick={() => {
                                  if (task?.id !== undefined) {
                                    handleDelete(task.id);
                                  }
                                }}
                                title="Sil"
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        );
                      })
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

      <FlowBuilder
        show={showFlowBuilder}
        onHide={() => setShowFlowBuilder(false)}
        onSave={handleSaveFlow}
        task={editingTask}
      />
      
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
                <StageFlow 
                  stages={getActiveStages(detailTask.stages)} 
                />
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