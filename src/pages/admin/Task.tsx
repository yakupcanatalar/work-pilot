import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Spinner, Container, Alert } from 'react-bootstrap';
import PageHeader from '../../components/PageHeader';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { useTaskService } from '../../services/TaskService';
import { ErrorMessage } from '../../utils/ErrorMessage';

interface Task {
  id: number;
  name: string;
  assignedTo?: string;
  status?: string;
  dueDate?: string;
}

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { getTasks } = useTaskService();

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(ErrorMessage.get(err));
      }
      setLoading(false);
    };
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="py-4">
      <PageHeader title="Görevler" icon={faShoppingBag} />
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Görevler</h5>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
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
                    <td>{task.name}</td>
                    <td>{task.assignedTo || '-'}</td>
                    <td>{task.status || '-'}</td>
                    <td>{task.dueDate || '-'}</td>
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