import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Spinner, Container } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import { faTasks } from '@fortawesome/free-solid-svg-icons';

interface Task {
  id: number;
  title: string;
  assignedTo: string;
  status: string;
  dueDate: string;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Replace with your API endpoint
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  return (
            <Container className="py-4">
      <PageHeader title="Görevler" icon={faTasks} />
    <Card className="shadow-sm">
      <Card.Header>
        <h5 className="mb-0">Görevler</h5>
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
                <th>Başlık</th>
                <th>Atanan</th>
                <th>Durum</th>
                <th>Bitiş Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.title}</td>
                  <td>{task.assignedTo}</td>
                  <td>{task.status}</td>
                  <td>{task.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button variant="primary" className="mt-3">
          Yeni Görev Ekle
        </Button>
      </Card.Body>
    </Card>
  </Container>
  );
};

export default TaskPage;