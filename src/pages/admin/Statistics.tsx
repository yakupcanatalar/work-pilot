import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Container } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';

interface StatisticsData {
  totalCustomers: number;
  totalWorkflows: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
}

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/statistics')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="py-4">
      <PageHeader title="İstatistikler" icon={faChartBar} />
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Başlık</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="info" />
            </div>
          ) : stats ? (
            <Row className="gy-4">
              <Col md={4}>
                <Card className="text-center border-info">
                  <Card.Body>
                    <h6>Müşteri Sayısı</h6>
                    <h3>{stats.totalCustomers}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center border-info">
                  <Card.Body>
                    <h6>İş Akışı Sayısı</h6>
                    <h3>{stats.totalWorkflows}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="text-center border-info">
                  <Card.Body>
                    <h6>Toplam Görev</h6>
                    <h3>{stats.totalTasks}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="text-center border-success">
                  <Card.Body>
                    <h6>Tamamlanan Siparişler</h6>
                    <h3 className="text-success">{stats.completedTasks}</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="text-center border-warning">
                  <Card.Body>
                    <h6>Bekleyen Siparişler</h6>
                    <h3 className="text-warning">{stats.pendingTasks}</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div className="text-center text-muted">Veri bulunamadı.</div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default StatisticsPage;