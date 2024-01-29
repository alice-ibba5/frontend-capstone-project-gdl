import { Container, Image, Spinner, Form, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CalendarElement from "../Profile/CalendarXProfile/CalendarXprofile.js";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";

import "./styles.css";

const Profile = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [isMounted, setIsMounted] = useState(true);
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const [file, setFile] = useState(null);

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

  const editAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", file, "avatar");

    try {
      let fileResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}/avatar`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (fileResponse.ok) {
        const fileDataResponse = await fileResponse.json();

        setFile(formData);

        toast("Avatar changed successfully!", {
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
          window.location.href = `/users/me/${storedUserId}`;
        }, 2000);
      } else {
        throw new Error(`HTTP error! Status: ${fileResponse.status}`);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

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
            <Col lg={6} className="mt-4 d-flex flex-column">
              <Image
                className="avatar align-item-center mb-2"
                src={user.avatar}
                fluid
                style={{ width: "200px" }}
              />

              <Button
                variant="dark"
                className="font-face-CinzelDecorative align-self-start mt-3"
                onClick={handleShow2}
              >
                Edit Avatar
              </Button>
              <Modal show={show2} onHide={handleClose2}>
                <Form className="mt-3" onSubmit={editAvatar}>
                  <Form.Group className="mt-3 mx-3">
                    <Form.Label>Cover</Form.Label>
                    <div>
                      <input
                        type="file"
                        multiple={false}
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                  </Form.Group>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleClose2}
                      className="font-face-CinzelDecorative align-self-center"
                    >
                      Close
                    </Button>
                    <Button
                      variant="dark"
                      className="font-face-CinzelDecorative"
                      type="submit"
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal>
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
                  <Form className="d-flex mx-5">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form>
                  {user?.friendId
                    ?.filter(
                      (b) =>
                        b.name
                          ?.toLowerCase()
                          .includes(searchQuery?.toLowerCase()) ||
                        b.surname
                          ?.toLowerCase()
                          .includes(searchQuery?.toLowerCase())
                    )
                    .map((friend, i) => (
                      <Modal.Body className="d-flex">
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
                          className="align-self-center font-face-CinzelDecorative carouselCaption ms-3"
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
            <h4 className="font-face-CinzelDecorative my-3">GDL attended: </h4>
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

          <Container className="container-gdl p-0">
            <h4 className="font-face-CinzelDecorative my-3">
              GDSeries attended:{" "}
            </h4>
            <Container className="d-flex flex-row flex-wrap">
              {user?.gdSeriesId?.map((gdSerie, index) => (
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
                      to={`/gdSeries/${gdSerie?._id}`}
                      className="gdl-link align-self-center"
                    >
                      <Image
                        className="cover mb-3"
                        src={gdSerie.cover}
                        fluid
                        style={{ width: "100px" }}
                      />
                    </Link>
                    <p
                      className="align-self-center font-face-CinzelDecorative"
                      key={index}
                    >
                      {gdSerie.title}
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

export default Profile;
