import React from 'react';
import { Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';


const NotFoundPage: React.FC = () => {
  return (
    <Container className="text-center mt-5">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Nav className="justify-content-center">
        <Nav.Item>
          <Nav.Link as={Link} to="/">Go to Homepage</Nav.Link>
        </Nav.Item>
      </Nav>
    </Container>
  );
};

export default NotFoundPage;