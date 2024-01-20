import { Container, Image, Spinner, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CalendarElement from "../Profile/CalendarXProfile/CalendarXprofile.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import "./styles.css";

const Profile = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [isMounted, setIsMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
          {
            headers: {
              Authorization: "Bearer " + storedUserToken,
            },
          }
        );

        if (isMounted && userResponse.ok) {
          const data = await userResponse.json();
          setUser(data);
        } else {
          console.log("Error fetching user data:", userResponse.statusText);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to set isMounted to false when the component is unmounted
    return () => {
      setIsMounted(false);
    };
  }, [storedUserId, storedUserToken, isMounted]);

  return (
    <>
      {loading ? (
        <Spinner animation="grow" variant="dark" className="spinner" />
      ) : (
        <Container>
          <h1 className="nome-cognome font-face-CinzelDecorative mt-3">
            {user.name} {user.surname}
          </h1>

          <Container className="p-0 d-flex">
            <Col lg={6} className="mt-4">
              <Image
                className="avatar align-item-center mb-5"
                src={user.avatar}
                fluid
                style={{ width: "200px" }}
              />
            </Col>
            <Col lg={6} className="">
              <h4 className="font-face-CinzelDecorative my-3">
                Following:{" "}
                <Button variant="dark" onClick={handleShow}>
                  <b>{user.friendId.length}</b>
                </Button>
              </h4>
              <Col className="d-flex usersSeguiti">
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title className="font-face-CinzelDecorative my-3">
                      Following:
                    </Modal.Title>
                  </Modal.Header>
                  {user?.friendId?.map((friend, i) => (
                    <Modal.Body>
                      <Link
                        to={`/users/${friend._id}`}
                        className="gdl-link align-self-center"
                      >
                        <Image
                          className="avatar mb-3 me-2"
                          src={friend.avatar}
                          fluid
                          style={{ width: "100px" }}
                        />
                      </Link>

                      <p
                        className="align-self-center font-face-CinzelDecorative carouselCaption"
                        key={i}
                      >
                        {friend.name} {friend.surname}
                      </p>
                    </Modal.Body>
                  ))}
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="font-face-CinzelDecorative my-3"
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Col>
            </Col>
          </Container>
          <hr></hr>
          <Container className="container-gdl p-0">
            <h4 className="font-face-CinzelDecorative my-3">
              GDL a cui partecipi:{" "}
            </h4>
            <Container className="d-flex flex-row flex-wrap">
              {user?.gdlId?.map((gdl, index) => (
                <>
                  <Col
                    xl={2}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={6}
                    className="d-flex flex-column"
                  >
                    <Link
                      to={`/gdl/${gdl?._id}`}
                      className="gdl-link align-self-center"
                    >
                      <Image
                        className="cover mb-3"
                        src={gdl.cover}
                        fluid
                        style={{ width: "100px" }}
                      />
                    </Link>
                    <p
                      className="align-self-center font-face-CinzelDecorative"
                      key={index}
                    >
                      {gdl.bookTitle}
                    </p>
                  </Col>
                </>
              ))}
            </Container>
          </Container>
          <hr></hr>

          {/* CALENDAR  */}
          <CalendarElement />
        </Container>
      )}
    </>
  );
};

export default Profile;
