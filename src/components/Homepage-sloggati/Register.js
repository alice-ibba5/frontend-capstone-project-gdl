import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { GoogleLoginButton } from "react-social-login-buttons";
import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";
import "./styles.css";
import "react-toastify/dist/ReactToastify.css";

function Register(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      name: name,
      surname: surname,
      email: email,
      password: password,
      dateOfBirth: dateOfBirth,
    };

    const formData = new FormData();
    formData.append("avatar", file, "avatar");

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(textData),
        }
      );

      if (textResponse.ok) {
        setBlog(textData);

        const data = await textResponse.json();
        const { _id } = data;

        const fileResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${_id}/avatar`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (fileResponse.ok) {
          toast("User registered successfully!", {
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
            window.location.href = "/";
          }, 2000);

          const fileDataResponse = await fileResponse.json();
          console.log(fileDataResponse);

          setFile(formData);

          console.log("textData:", textData);
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/verifyEmail`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: textData.email,
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
        } else {
          throw new Error(`HTTP error! Status: ${fileResponse.status}`);
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    console.log("Login button clicked");
    props.onLoginSubmit();
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={handleShow}
        className="font-face-CinzelDecorative mt-3"
      >
        Sign up
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="font-face-CinzelDecorative">
            Sign up to this magical world ✨
          </Modal.Title>
        </Modal.Header>

        <Form className="mt-5" onSubmit={handleSubmit}>
          <Form.Group controlId="blog-form" className="mt-3 mx-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              size="lg"
              placeholder="Nome"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="blog-form" className="mt-3 mx-3">
            <Form.Label>Surname</Form.Label>
            <Form.Control
              size="lg"
              placeholder="Cognome"
              required
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3 mx-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              size="lg"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3 mx-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              size="lg"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3 mx-3">
            <Form.Label>Date of birth</Form.Label>
            <Form.Control
              size="lg"
              placeholder="dd/mm/yyyy"
              required
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mt-3 mx-3">
            <Form.Label>Avatar</Form.Label>
            <div>
              <input
                type="file"
                //value={file}
                multiple={false}
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
          </Form.Group>

          <Modal.Footer>
            <Form.Group className="d-flex mt-3 justify-content-end">
              <Button
                type="reset"
                size="lg"
                variant="outline-dark"
                onClick={handleClose}
                className="font-face-CinzelDecorative"
              >
                Reset
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="dark"
                style={{
                  marginLeft: "1em",
                }}
                className="font-face-CinzelDecorative"
                onClick={() => {
                  handleButtonClick();
                  handleClose();
                }}
              >
                Invia
              </Button>
            </Form.Group>
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

export default Register;
