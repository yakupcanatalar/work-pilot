import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faShoppingBag,
  faProjectDiagram,
  faTachometerAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/PageHeader';
import AddEditCustomerModal from '../../components/modals/AddEditCustomerModal';
import FlowBuilder from '../admin/FlowBuilder';
import { useCustomerService } from '../../services/CustomerService';
import TaskStageDto from '../../dtos/TaskStageDto';
import { useTaskService } from '../../services/TaskService';
import { useDashboardService } from '../../services/DashboardService';
import CustomerDto from '../../dtos/CustomerDto';
import { ErrorMessage } from '../../utils/ErrorMessage';


const emptyCustomer: CustomerDto = {
  id: 0,
  name: '',
  phoneNumber: '',
  email: '',
  address: '',
  note: '',
};

interface DashboardStats {
  totalCustomers: number;
  activeTasks: number;
  workflows: number;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeTasks: 0,
    workflows: 0
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState<CustomerDto>(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    createCustomer,
  } = useCustomerService();
  const { createTask } = useTaskService();
  const { getDashboardSummary } = useDashboardService();

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const summaryData = await getDashboardSummary();
        setStats({
          totalCustomers: summaryData.activeCustomers,
          activeTasks: summaryData.activeTasks,
          workflows: summaryData.activeOrders
        });
      } catch (error) {
        console.error('Dashboard istatistikleri yüklenirken hata:', error);
        setError(ErrorMessage.get(error));
      }
    };

    loadDashboardStats();
    // eslint-disable-next-line
  }, []);

  const dashboardCards = [
    {
      title: 'Toplam Aktif Müşteri',
      value: stats.totalCustomers.toLocaleString(),
      icon: faUsers,
      color: 'primary'
    },
    {
      title: 'Toplam Aktif Görev Sayısı',
      value: stats.activeTasks.toString(),
      icon: faShoppingBag,
      color: 'success'
    },
    {
      title: 'Toplam Aktif Sipariş Sayısı',
      value: stats.workflows.toString(),
      icon: faProjectDiagram,
      color: 'info'
    }
  ];

  const handleShowAddModal = () => {
    setModalCustomer(emptyCustomer);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setModalCustomer(emptyCustomer);
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
      await createCustomer(modalCustomer);
      setShowAddModal(false);
      setModalCustomer(emptyCustomer);

      // Dashboard istatistiklerini yeniden yükle
      const summaryData = await getDashboardSummary();
      setStats({
        totalCustomers: summaryData.activeCustomers,
        activeTasks: summaryData.activeTasks,
        workflows: summaryData.activeOrders
      });
    } catch (err) {
      console.error('Error saving customer:', err);
      setError(ErrorMessage.get(err));
    }
    setLoading(false);
  };

  const handleShowFlowBuilder = () => {
    setShowFlowBuilder(true);
  };

  const handleCloseFlowBuilder = () => {
    setShowFlowBuilder(false);
  };

  const handleSaveFlow = async (flowData: { name: string; note: string; stages: TaskStageDto[] }) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const taskData = {
        name: flowData.name,
        note: flowData.note,
        stageIds: flowData.stages.map(stage => stage.id!).filter(id => id !== undefined)
      };

      await createTask(taskData);
      setSuccess('İş akışı başarıyla oluşturuldu!');

      setShowFlowBuilder(false);

      // Dashboard istatistiklerini yeniden yükle
      const summaryData = await getDashboardSummary();
      setStats({
        totalCustomers: summaryData.activeCustomers,
        activeTasks: summaryData.activeTasks,
        workflows: summaryData.activeOrders
      });

      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving workflow:', error);
      setError(ErrorMessage.get(error));
    }
    setLoading(false);
  };

  return (
    <Container className="py-4">
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

      <div>
        <PageHeader title="Dashboard" icon={faTachometerAlt} />
      </div>

      <Row className="mb-4">
        {dashboardCards.map((stat, index) => (
          <Col key={index} md={3} sm={6} className="mb-3">
            <Card className={`stat-card bg-${stat.color}-light`}>
              <Card.Body>
                <div className="stat-icon">
                  <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color}`} />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.title}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              <p>No recent activities</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5>Quick Actions</h5>
            </Card.Header>
            <Card.Body>
              <button
                className="btn btn-primary mb-2 w-100"
                onClick={handleShowAddModal}
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Yeni Müşteri
              </button>
              <button
                className="btn btn-info w-100"
                onClick={handleShowFlowBuilder}
              >
                <FontAwesomeIcon icon={faProjectDiagram} className="me-2" />
                Yeni Akış
              </button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <AddEditCustomerModal
        show={showAddModal}
        isEdit={false}
        loading={loading}
        customer={modalCustomer}
        onChange={handleModalChange}
        onClose={handleCloseAddModal}
        onSave={handleSave}
      />
      <FlowBuilder
        show={showFlowBuilder}
        onHide={handleCloseFlowBuilder}
        onSave={handleSaveFlow}
        task={null}
      />
    </Container>
  );
};

export default DashboardPage;