import React from 'react';
import { Container, Row, Col } from "react-bootstrap";
import Wheel from './Wheel/Wheel';
import Board from './Board/Board';
import "./RouletteStyles.scss";

const RoulettePage = () => {
  return (
    <div className='roulette-page-wrapper'>
      <Container>
        <Row>
          <Col lg={6} md={12}>
            <Wheel/>
          </Col>
          <Col lg={6} md={12}>
            <Board/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RoulettePage;