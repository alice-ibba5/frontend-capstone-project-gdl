import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/gdl-logo.png";
import "./styles.css";

// import { Button, Container, Navbar, Nav, Form, NavDropdown, Image, Row } from "react-bootstrap";

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary font-face-CinzelDecorative">
      <Container fluid>
        <Navbar.Brand href="#">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link href="/gdl">Home</Nav.Link>
            <Nav.Link href="/chi-siamo">Chi siamo</Nav.Link>
            <Nav.Link href="/contatti">Contatti</Nav.Link>
            <Nav.Link href="/nuova-proposta">Proponi un GDL!</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-dark">Search</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
