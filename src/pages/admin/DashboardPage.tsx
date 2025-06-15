import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faShoppingBag,
  faProjectDiagram,
  faChartLine,
  faTachometerAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/PageHeader';
import AddEditCustomerModal from '../../components/modals/AddEditCustomerModal';
import FlowBuilder from '../admin/FlowBuilder';
import CustomerDto from '../../dtos/CustomerDto';
import CustomerService from '../../services/CustomerService';
import TaskStageDto from '../../dtos/TaskStageDto';
import { createTask, getTasks } from '../../services/TaskService';

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
  productivity: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeTasks: 0,
    workflows: 0,
    productivity: '0%'
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [modalCustomer, setModalCustomer] = useState<CustomerDto>(emptyCustomer);
  const [loading, setLoading] = useState(false);
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        const customers = await CustomerService.getAllCustomers();
        const totalCustomers = customers.length;

        const tasks = await getTasks();
        const workflows = tasks.length;

        setStats(prev => ({
          ...prev,
          totalCustomers,
          workflows
        }));
      } catch (error) {
        console.error('Dashboard istatistikleri yüklenirken hata:', error);
      }
    };

    loadDashboardStats();
  }, []);

  const dashboardCards = [
    { 
      title: 'Toplam Aktif Müşteri', 
      value: stats.totalCustomers.toLocaleString(), 
      icon: faUsers, 
      color: 'primary' 
    },
    { 
      title: 'Toplam Aktif Sipariş Sayısı', 
      value: stats.activeTasks.toString(), 
      icon: faShoppingBag, 
      color: 'success' 
    },
    { 
      title: 'Toplam Aktif İş Akışı', 
      value: stats.workflows.toString(), 
      icon: faProjectDiagram, 
      color: 'info' 
    },
    { 
      title: 'Üretkenlik Oranı', 
      value: stats.productivity, 
      icon: faChartLine, 
      color: 'warning' 
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
      await CustomerService.createCustomer(modalCustomer);
      setShowAddModal(false);
      setModalCustomer(emptyCustomer);
      
      const customers = await CustomerService.getAllCustomers();
      setStats(prev => ({
        ...prev,
        totalCustomers: customers.length
      }));
    } catch (err) {
      console.error('Error saving customer:', err);
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
      
      const tasks = await getTasks();
      setStats(prev => ({
        ...prev,
        workflows: tasks.length
      }));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving workflow:', error);
      setError('İş akışı kaydedilirken hata oluştu!');
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
              <button className="btn btn-success mb-2 w-100">
                <FontAwesomeIcon icon={faShoppingBag} className="me-2" />
                Yeni Görev
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