import {
  Button,
  Container,
  Navbar,
  Nav,
  Form,
  Col,
  Image,
  Row,
} from "react-bootstrap";
import logo from "../../assets/gdl-logo.png";
import "./styles.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function NavBar({ searchQuery, setSearchQuery }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const isLogged = async () => {
    const storedUserId = localStorage.getItem("userId");
    const storedToken = localStorage.getItem("token");

    if (storedUserId) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        if (response.ok) {
          const userDetails = await response.json();
          setUser(userDetails);
          setIsLoggedIn(true);
        } else {
          localStorage.clear();
          window.location.href = "/";
          toast("You need to login again!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  useEffect(() => {
    console.log("useEffect is triggered");
    isLogged();
  }, []);

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary font-face-CinzelDecorative"
      sticky="top"
      style={{ height: "70px" }}
    >
      <Container fluid>
        <Navbar.Brand href="#">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse
          id="navbarScroll"
          style={{ backgroundColor: "#F4ECE8" }}
        >
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ backgroundColor: "#F4ECE8" }}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>

          {user && isLoggedIn ? (
            <div className="my-3 mx-3 d-flex">
              <Row>
                <Col className="pe-0 align-self-center">
                  <Link to={`/users/${user?._id}`} className="gdl-link">
                    <Image
                      className="blog-user "
                      src={user?.avatar}
                      roundedCircle
                      style={{ width: "30px", height: "30px" }}
                    />
                  </Link>
                </Col>
              </Row>
              <Button
                variant="danger"
                className="my-3 mx-3"
                onClick={() => {
                  navigate("/");
                  localStorage.clear();
                  setUser(false);
                  setIsLoggedIn(false);
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div></div>
          )}
        </Navbar.Collapse>
      </Container>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Navbar>
  );
}

export default NavBar;
