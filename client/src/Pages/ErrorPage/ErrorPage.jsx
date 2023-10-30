import React from 'react';
import './ErrorStyles.scss';
import {Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div className='error-page-wrapper bg-red-600 h-screen'>
      <Container className="error-content-wrapper flex justify-center items-center">
        <Row>
        <Col lg={6} md={12} className="error-info">
          <h2 className='text-yellow-500 text-4xl font-bold mb-8 ml-10'>Error 404</h2>
          <p className='text-white ml-10'>You are out of luck, we couldn't find what you were looking for.</p>
          <button>
            <Link to="/">Go Home</Link>
          </button>
        </Col>
        <Col lg={6} md={12} className="slot-machine-img">
          <img src='../../../src/assets/images/slot-machine-img.png' alt='slots image'/>
        </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ErrorPage;