import React from 'react';
import { Row, Col, Card, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTasks,
  faProjectDiagram,
  faChartLine,
  faTachometerAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/PageHeader';

const DashboardPage: React.FC = () => {
  const stats = [
    { title: 'Total Customers', value: '1,254', icon: faUsers, color: 'primary' },
    { title: 'Active Tasks', value: '42', icon: faTasks, color: 'success' },
    { title: 'Workflows', value: '18', icon: faProjectDiagram, color: 'info' },
    { title: 'Productivity', value: '87%', icon: faChartLine, color: 'warning' }
  ];

  return (
    <Container className="py-4">
      <div>
        <PageHeader title="Dashboard" icon={faTachometerAlt} />
      </div>
      
      {/* Stats Cards */}
      <Row className="mb-4">
        {stats.map((stat, index) => (
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

      {/* Recent Activities */}
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5>Recent Activities</h5>
            </Card.Header>
            <Card.Body>
              {/* Activity list would go here */}
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
              <button className="btn btn-primary mb-2 w-100"><FontAwesomeIcon icon={faUser} className="me-2" />Yeni Müşteri</button>
              <button className="btn btn-success mb-2 w-100"><FontAwesomeIcon icon={faTasks} className="me-2" />Yeni Görev</button>
              <button className="btn btn-info w-100">+<FontAwesomeIcon icon={faProjectDiagram} className="me-2" />Yeni Akış</button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;