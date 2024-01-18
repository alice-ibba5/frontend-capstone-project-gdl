import React from "react";
import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  Facebook,
  Whatsapp,
  Instagram,
  Twitch,
  Twitter,
  Telegram,
} from "react-bootstrap-icons";
import { ToastContainer, toast } from "react-toastify";
import "./ContattiStyles.css";

const Contatti = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const storedUserId = localStorage.getItem("userId");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      user: storedUserId,
      name: name,
      surname: surname,
      email: email,
      message: message,
    };

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/receiveEmail`,
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

        const data = {
          user: storedUserId,
          name: name,
          surname: surname,
          email: email,
          message: message,
        };

        try {
          let response = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/emailAlSito`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(data),
            }
          );

          if (response.ok) {
            setBlog(data);
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }

        toast("Email sent successfully!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

        // setTimeout(() => {
        //   window.location.href = "/";
        // }, 2000);

        console.log("textData:", textData);
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/contattiEmail`,
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
          } else {
            console.error("Failed to send email:", response.statusText);
          }
        } catch (error) {
          console.error("Error sending email:", error);
        }
      } else {
        throw new Error(`HTTP error!`);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col lg={6}>
            <h3 className="font-face-CinzelDecorative mt-3">Contatti</h3>
            <h6 className="font-face-CinzelDecorative mt-3">Email:</h6>
            <p>gdlove.wordsforthesoul@gmail.com</p>
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
            <h3 className="font-face-CinzelDecorative mt-3 hr">
              Inviaci una mail!
            </h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3 d-none" controlId="formBasicEmail">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={storedUserId}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Cognome</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Il tuo messaggio</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Scrivi qui..."
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
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
};

export default Contatti;
