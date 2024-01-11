import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";

function HomeSlog() {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setShow2(false);
  const handleShow = () => setShow(true);
  const handleShow2 = () => setShow2(true);

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
      }
      window.location.reload();

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
    }
  };

  useEffect(() => {
    GoogleCallbackComponent();
    console.log("useEffect is triggered");
  }, []);

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
                const response = await fetch(
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

                if (response.ok) {
                  const data = await response.json();
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
    }
  };

  useEffect(() => {
    console.log("useEffect is triggered");
    isLogged();
  }, []);

  return (
    <>
      <Button variant="dark" onClick={handleShow}>
        Log in
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Entra in questo magico mondo!</Modal.Title>
        </Modal.Header>
        <Form>
          <Form.Group className="mb-3 mx-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group className="mb-3 mx-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
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
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Button variant="danger" onClick={handleShow2}>
        Register
      </Button>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose2}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default HomeSlog;
