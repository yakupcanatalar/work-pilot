import { faWebflow } from '@fortawesome/free-brands-svg-icons';
import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Spinner, Container } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import { faProjectDiagram } from '@fortawesome/free-solid-svg-icons';

interface Workflow {
  id: number;
  name: string;
  status: string;
  owner: string;
  createdAt: string;
}

const WorkflowPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/workflows')
      .then((res) => res.json())
      .then((data) => {
        setWorkflows(data);
        setLoading(false);
      });
  }, []);

  return (

            <Container className="py-4">
      <PageHeader title="İş Akışları" icon={faProjectDiagram} />
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">İş Akışları</h5>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="info" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>İş Akışı Adı</th>
                <th>Durum</th>
                <th>Sahibi</th>
                <th>Oluşturulma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map((workflow) => (
                <tr key={workflow.id}>
                  <td>{workflow.id}</td>
                  <td>{workflow.name}</td>
                  <td>{workflow.status}</td>
                  <td>{workflow.owner}</td>
                  <td>{workflow.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button variant="primary" className="mt-3">
          Yeni İş Akışı Ekle
        </Button>
      </Card.Body>
    </Card>
    </Container>
  );
};

export default WorkflowPage;