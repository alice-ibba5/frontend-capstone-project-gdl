import Login from "./Login.js";
import Register from "./Register.js";
import "./styles.css";
import { Link, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";

const HomeSlog = (props) => {
  const { user, isLoggedIn } = props;
  return (
    <>
      {!user && !isLoggedIn ? (
        <Container>
          <Login />
          <Register />
        </Container>
      ) : (
        <Navigate to={`/gdl`} className="gdls-link"></Navigate>
      )}
    </>
  );
};

export default HomeSlog;
