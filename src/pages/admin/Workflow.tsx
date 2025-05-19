import { faProjectDiagram, faEdit, faTrash, faPlus, faInfoCircle, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Form, InputGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/PageHeader';
import { getTasks } from '../../services/TaskService';
import FlowBuilder from './FlowBuilder';

interface TaskStageDto {
  id: number;
  name: string;
}

interface Task {
  id: number;
  userId: number;
  name: string;
  note?: string;
  stages: TaskStageDto[];
}

const WorkflowPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFlowBuilder, setShowFlowBuilder] = useState(false); // Yeni ekledik

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  // Search filter
  const filteredTasks = tasks.filter(task =>
    (task.name && task.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.note && task.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.stages && task.stages.some(stage => stage.name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Pagination
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

  // Yeni ekledik: FlowBuilder'dan gelen verileri işle
  const handleSaveFlow = (flowData: { nodes: any[]; edges: any[] }) => {
    // Burada akış verilerini kaydetme işlemini yapabilirsiniz
    console.log('Flow data to save:', flowData);
    
    // Örnek olarak tasks listesine yeni bir task ekliyoruz
    const newTask: Task = {
      id: tasks.length + 1,
      userId: 1, // Varsayılan kullanıcı ID
      name: `Yeni Akış ${tasks.length + 1}`,
      note: 'Yeni oluşturulan akış',
      stages: flowData.nodes.map(node => ({
        id: parseInt(node.id),
        name: node.data.label
      }))
    };
    
    setTasks([...tasks, newTask]);
    setShowFlowBuilder(false);
  };

  return (
    <Container className="py-4">
      <PageHeader title="Görevler" icon={faProjectDiagram} />
      <Row>
        <Col md={12}>
          <Row className="mb-3">
            <Col md={10}>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-light"
                />
                <Button variant="outline-secondary" onClick={fetchTasks}>
                  Ara
                </Button>
              </InputGroup>
            </Col>
            <Col md={2} className="d-flex justify-content-end">
              <Button
                variant="primary"
                className="d-flex align-items-center"
                onClick={() => setShowFlowBuilder(true)}
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Yeni İş Akışı Ekle
              </Button>
            </Col>
          </Row>
        </Col>
        <Col md={12}>
          <Card className="mb-2">
            <Card.Header>
              <h5 className="mb-0">Görev Listesi</h5>
            </Card.Header>
          </Card>
          <Row>
            <Col md={12}>
              <div className="table-responsive">
                <Table
                  hover
                  bordered
                  className="align-middle table-striped shadow-sm rounded"
                  style={{ background: "#fff", borderRadius: "0.5rem", overflow: "hidden" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th>Sıra</th>
                      <th>Adı</th>
                      <th>Kullanıcı ID</th>
                      <th>Not</th>
                      <th>Aşamalar</th>
                      <th style={{ width: 140 }}>İşlemler</th>
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
                          Kayıt bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      paginatedTasks.map((task, index) => (
                        <tr key={task.id}>
                          <td>{(currentPage - 1) * pageSize + index + 1}</td>
                          <td>
                            <span>{task.name}</span>
                            <FontAwesomeIcon icon={faInfoCircle} className="ms-2 text-info" />
                          </td>
                          <td>{task.userId}</td>
                          <td>{typeof task.note === 'string' ? task.note : '-'}</td>
                          <td>
                            {task.stages && task.stages.length > 0
                              ? task.stages.map(stage => stage.name).join(', ')
                              : '-'}
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="warning"
                                size="sm"
                                title="Güncelle"
                                style={{ borderRadius: 20, minWidth: 36 }}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                title="Sil"
                                style={{ borderRadius: 20, minWidth: 36 }}
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
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mt-3 px-2 py-2 bg-light rounded shadow-sm border">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fw-semibold">Sayfa boyutu:</span>
                    <Form.Select
                      size="sm"
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      style={{ width: 90, minWidth: 70 }}
                      className="shadow-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </Form.Select>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="rounded-circle px-2"
                      title="Önceki Sayfa"
                    >
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <span className="fw-semibold" style={{ minWidth: 60, textAlign: 'center' }}>
                      {currentPage} / {totalPages || 1}
                    </span>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="rounded-circle px-2"
                      title="Sonraki Sayfa"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {/* FlowBuilder Modal'ını ekledik */}
      <FlowBuilder 
        show={showFlowBuilder} 
        handleClose={() => setShowFlowBuilder(false)} 
        onSave={handleSaveFlow}
      />
    </Container>
  );
};

export default WorkflowPage;