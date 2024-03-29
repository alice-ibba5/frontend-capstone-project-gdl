import { Container, Image, Spinner, Col, Button, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./styles.css";
import Modal from "react-bootstrap/Modal";

const OtherProfile = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState({});
  const [user, setUser] = useState({});
  const [friend, setFriend] = useState("");
  const [friendId, setFriendId] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalStates, setModalStates] = useState({});

  const handleClose = (userId) => {
    setModalStates((prevStates) => ({
      ...prevStates,
      [userId]: false,
    }));
  };
  const handleShow = (userId) => {
    setModalStates((prevStates) => ({
      ...prevStates,
      [userId]: true,
    }));
  };

  const [isMounted, setIsMounted] = useState(true);
  const { _id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ottenere i dati dell'utente loggato
        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
          {
            headers: {
              Authorization: "Bearer " + storedUserToken,
            },
          }
        );

        if (userResponse.ok) {
          const userData = await userResponse.json();

          // Aggiorna lo stato friends con gli amici dell'utente loggato
          const userFriends = userData.friendId || [];
          setFriends(userFriends);
        } else {
          console.log("Error fetching user data:", userResponse.statusText);
        }

        // Ottenere i dati dell'utente visualizzato
        if (!_id) {
          console.error("Error: _id is undefined");
          // Gestisci l'errore in modo appropriato, ad esempio, reindirizza l'utente o mostra un messaggio di errore
          return;
        }
        const otherUserResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${_id}`
        );

        if (otherUserResponse.ok) {
          const data = await otherUserResponse.json();
          console.log("data is:", data);
          setUser(data);
        } else {
          console.log(
            "Error fetching user data:",
            otherUserResponse.statusText
          );
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
  }, [_id, storedUserId, storedUserToken, isMounted]);

  const follow = async () => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserToken = localStorage.getItem("token");
    setLoading(true);

    try {
      // Ottieni gli amici dell'utente loggato dal backend
      const userResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
        {
          headers: {
            Authorization: "Bearer " + storedUserToken,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("userData is: ", typeof userData);
        const userFriends = userData.friendId || []; // Array degli amici dell'utente

        console.log("friends is: ", typeof friends);

        // Verifica se l'amico è già presente nell'array degli amici dell'utente
        let isFriendAlreadyAdded = false;

        for (const userObj of userFriends) {
          for (const key in userObj) {
            if (userObj.hasOwnProperty(key) && userObj[key] === _id) {
              isFriendAlreadyAdded = true;
              break;
            }
          }

          if (isFriendAlreadyAdded) {
            break;
          }
        }
        console.log(isFriendAlreadyAdded);
        if (!isFriendAlreadyAdded) {
          // Aggiungi l'amico all'array degli amici dell'utente
          const newFriend = [...userFriends];
          newFriend.push(_id);

          // Invia la richiesta di aggiornamento degli amici dell'utente al backend
          const updateResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + storedUserToken,
              },
              method: "PUT",
              body: JSON.stringify({ friendId: newFriend }),
            }
          );

          if (updateResponse.ok) {
            // Aggiungi l'amico all'array degli amici utilizzando push
            setFriend(newFriend);
            setIsFollowing(true);
            setFriendId(_id);
          }

          toast("Now you're following them!", {
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
            window.location.href = `/users/${_id}`;
          }, 2000);
        } else {
          // L'amico è già presente nell'array degli amici dell'utente
          toast.warn("You're already following them!", {
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
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async () => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserToken = localStorage.getItem("token");
    setLoading(true);

    try {
      // Ottieni gli amici dell'utente loggato dal backend
      const userResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
        {
          headers: {
            Authorization: "Bearer " + storedUserToken,
          },
        }
      );

      if (userResponse.ok) {
        const userData = await userResponse.json();
        console.log("userData is: ", typeof userData);
        const userFriends = userData.friendId || []; // Array degli amici dell'utente

        console.log("friends is: ", typeof friends);

        // Verifica se l'amico è già presente nell'array degli amici dell'utente
        let isFriendAlreadyAdded = true;

        for (const userObj of userFriends) {
          for (const key in userObj) {
            if (userObj.hasOwnProperty(key) && userObj[key] === _id) {
              isFriendAlreadyAdded = true;
              break;
            }
          }
        }

        if (isFriendAlreadyAdded) {
          // Aggiungi l'amico all'array degli amici dell'utente
          const newFriend = [...userFriends];
          newFriend.splice(_id);

          // Invia la richiesta di aggiornamento degli amici dell'utente al backend
          const updateResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + storedUserToken,
              },
              method: "PUT",
              body: JSON.stringify({ friendId: newFriend }),
            }
          );

          if (updateResponse.ok) {
            // Aggiungi l'amico all'array degli amici utilizzando push
            setFriend(newFriend);
            setIsFollowing(true);
            setFriendId(_id);
          }

          toast("You're not following them anymore!", {
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
            window.location.href = `/users/${_id}`;
          }, 2000);
        } else {
          // L'amico è già presente nell'array degli amici dell'utente
          toast.warn("You're already following them!", {
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
            {user?.name} {user?.surname}
          </h1>

          <Container className="p-0 d-flex">
            <Col lg={6} className="mt-4">
              <Image
                className="avatar align-item-center"
                src={user?.avatar}
                fluid
                style={{ width: "200px" }}
              />
            </Col>

            <Col lg={6} className="">
              {friends && friends.some((friend) => friend._id === _id) ? (
                <Button
                  className="font-face-CinzelDecorative align-self-center"
                  variant="dark"
                  onClick={isFollowing ? null : () => unfollow(_id)}
                >
                  {isFollowing ? "Follow" : "Unfollow"}
                </Button>
              ) : (
                <Button
                  className="buttonAggiungi font-face-CinzelDecorative align-self-center"
                  onClick={isFollowing ? null : () => follow(_id)}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
              <h4 className="font-face-CinzelDecorative my-3">
                Following:{" "}
                <Button variant="dark" onClick={() => handleShow(_id)}>
                  <b>{user?.friendId?.length}</b>
                </Button>
              </h4>
              <Col className="d-flex usersSeguiti">
                <Modal show={modalStates[_id]} onHide={() => handleClose(_id)}>
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
                          to={
                            friend._id === storedUserId
                              ? `/users/me/${storedUserId}`
                              : `/users/${friend._id}`
                          }
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

export default OtherProfile;
