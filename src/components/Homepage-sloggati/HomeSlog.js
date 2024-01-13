import Login from "./Login.js";
import Register from "./Register.js";
import "./styles.css";
import { Link } from "react-router-dom";
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
        <Link to={`/gdl`} className="gdls-link"></Link>
      )}
    </>
  );
};

export default HomeSlog;
