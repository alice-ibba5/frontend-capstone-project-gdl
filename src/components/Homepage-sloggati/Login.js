import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Login() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        setUser(true);
        toast("You are logged in!!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        setTimeout(() => {
          window.location.href = "/gdl";
        }, 2000);
      } else {
        // Mostra un messaggio o esegui altre azioni se il login non ha avuto successo
        toast("Login failed. Please check your credentials.", {
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

      const data2 = {
        authorId: localStorage.getItem("userId"),
        token: localStorage.getItem("token"),
      };

      const responseGet = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${data2.userId}`,
        {
          headers: {
            Authorization: `Bearer ${data2.token}`,
            method: "GET",
          },
        }
      );
      if (!responseGet.ok) {
        throw new Error(`HTTP error! Status: ${responseGet.status}`);
      } else {
        const data3 = await responseGet.json();
        setUser(data3);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const GoogleCallbackComponent = async () => {
    const queryParams = queryString.parse(window.location.search);
    const { token, userId } = queryParams;

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
    }
  };

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
          const email = userDetails.email;
          setUser(userDetails);
          setIsLoggedIn(true);

          // Chiamata per verificare se l'utente è già nel database
          const checkUserResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/checkUserExistence`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email,
              }),
            }
          );

          if (checkUserResponse.ok) {
            const { userExists } = await checkUserResponse.json();

            if (!userExists) {
              // L'utente non è ancora nel database, puoi inviare l'email di benvenuto

              try {
                const welcomeEmailResponse = await fetch(
                  `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/verifyEmail`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      email,
                    }),
                  }
                );

                if (welcomeEmailResponse.ok) {
                  const data = await welcomeEmailResponse.json();
                  toast("Welcome email sent successfully", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                  });
                } else {
                  console.error(
                    "Failed to send welcome email:",
                    response.statusText
                  );
                }
              } catch (error) {
                console.error("Error sending welcome email:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      toast("You are logged in with Google!!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setTimeout(() => {
        window.location.href = "/gdl";
      }, 2000);
    }
  };

  useEffect(() => {
    console.log("useEffect is triggered");
    isLogged();
    GoogleCallbackComponent();
  }, []);

  return (
    <>
      <Button
        variant="dark"
        onClick={handleShow}
        className="font-face-CinzelDecorative"
      >
        Log in
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="font-face-CinzelDecorative">
            Entra in questo magico mondo ✨
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3 mx-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 mx-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3 mx-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>

          <GoogleLoginButton
            className="mx-3"
            style={{ width: "250px" }}
            onClick={() => {
              window.location.assign(
                `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/google`
              );
            }}
          />

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
              className="font-face-CinzelDecorative"
            >
              Close
            </Button>

            <Button
              variant="dark"
              type="submit"
              className="font-face-CinzelDecorative"
            >
              Login
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
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
    </>
  );
}

export default Login;
