import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  Facebook,
  Whatsapp,
  Instagram,
  Twitch,
  Twitter,
  Telegram,
} from "react-bootstrap-icons";

const Contatti = () => {
  return (
    <Container>
      <Row>
        <Col lg={6}>
          <h3 className="font-face-CinzelDecorative mt-3">Contatti</h3>
          <h6 className="font-face-CinzelDecorative mt-3">Email:</h6>
          <p>gdlove@gmail.com</p>
          <h6 className="font-face-CinzelDecorative mt-3">
            Numero di telefono:
          </h6>
          <p>+39 346 1234567</p>
          <h6 className="font-face-CinzelDecorative mt-3">
            Vieni a trovarci sui social:
          </h6>
          <div className="mt-3">
            <Facebook className="me-2 fs-3" role="button" />
            <Whatsapp className="me-2 fs-3" role="button" />
            <Instagram className="me-2 fs-3" role="button" />
            <Twitch className="me-2 fs-3" role="button" />
            <Twitter className="me-2 fs-3" role="button" />
            <Telegram className="me-2 fs-3" role="button" />
          </div>
        </Col>

        <Col lg={6}>
          <h3 className="font-face-CinzelDecorative mt-3">Inviaci una mail!</h3>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Cognome</Form.Label>
              <Form.Control type="text" placeholder="Enter surname" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Il tuo messaggio</Form.Label>
              <Form.Control type="text" placeholder="Scrivi qui..." />
            </Form.Group>

            <Button
              variant="dark"
              type="submit"
              className="font-face-CinzelDecorative"
            >
              Invia!
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Contatti;
