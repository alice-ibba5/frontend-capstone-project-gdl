import React, { useEffect, useState } from "react";
import {
  Container,
  Image,
  Spinner,
  Col,
  Table,
  Button,
  Row,
  Modal,
  Form,
} from "react-bootstrap";
import { PencilFill, Trash3 } from "react-bootstrap-icons";
import { useNavigate, useParams } from "react-router-dom";
import Creator from "../../components/Homepage-loggati/Cards/Creator.js";
import CalendarElement from "./Calendar.js";
import queryString from "query-string";
import "./GdlDetailsStyles.css";

// import BlogLike from "../../components/likes/BlogLike";
import { ToastContainer, toast } from "react-toastify";

const GdlDetails = ({}) => {
  const storedUserId = localStorage.getItem("userId");
  const [gdlGet, setGdlGet] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comment, setComment] = useState();
  const [gdl, setGdl] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const getGdl = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGdlGet(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
    }
  };

  useEffect(() => {
    getGdl();
  }, []);

  const getComments = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/comments`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const addComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      gdl: gdl,
      text: text,
      user: user,
    };

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(textData),
        }
      );

      if (textResponse.ok) {
        setComment(textData);

        toast("Comment added successfully!", {
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
          window.location.href = `/gdl/${id}`;
        }, 2000);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Recupera il valore di 'authorId' dal localStorage al montaggio del componente
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser(storedUserId);
    }
  }, []);

  useEffect(() => {
    // Recupera il valore di 'gdlId' dall'URL al montaggio del componente

    if (id) {
      setGdl(id);
    }
  }, []);

  const deleteComment = (commentToDeleteId) => {
    if (commentToDeleteId) {
      fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/comments/${commentToDeleteId}`,
        {
          method: "DELETE",
        }
      )
        .then((r) => {
          if (r.ok) {
            toast("Comment deleted successfully!", {
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
              window.location.href = `/gdl/${id}`;
            }, 2000);
          } else {
            throw new Error("Something went wrong!");
          }
        })

        .catch((e) => console.error(e));
    } else {
      console.error("No comment id to delete");
    }
  };

  const changeComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      text: text,
    };
    if (commentToDeleteId) {
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/comments/${commentToDeleteId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          toast("Comment modified successfully!", {
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
            window.location.href = `/gdl/${id}`;
          }, 2000);
        } else {
          toast.error("Something went wrong!", {
            position: toast.POSITION.TOP_LEFT,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        handleClose2(); // Chiudi il modal dopo aver effettuato la modifica
      }
    } else {
      console.error("No comment id to delete");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  return (
    <>
      {loading ? (
        <Spinner animation="grow" variant="dark" className="spinner" />
      ) : (
        <Container>
          <h1 className="blog-details-title font-face-CinzelDecorative mt-3">
            {gdlGet?.bookTitle}
          </h1>
          <Container className="blog-details-root d-flex p-0">
            <Container className="p-0">
              <Col lg={6} className="mt-5">
                <Image
                  className="blog-details-cover align-item-center"
                  src={gdlGet?.cover}
                  fluid
                  style={{ width: "300px" }}
                />
              </Col>
            </Container>

            <Col lg={6} className="mt-5">
              <h4 className="font-face-CinzelDecorative">Trama del libro:</h4>
              <div>{gdlGet?.bookPlot}</div>
              <hr></hr>

              <div className="blog-details-container mt-3">
                <div className="blog-details-author">
                  <Creator {...gdlGet?.user} />
                </div>
                <div className="blog-details-info mt-3">
                  <div>{`Lettura da ${gdlGet?.readTime.value} ${gdlGet?.readTime.unit}`}</div>
                  <div>Deadline: {gdlGet?.deadline}</div>
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    {/* <BlogLike defaultLikes={["123"]} onChange={console.log} /> */}
                  </div>
                </div>
              </div>
            </Col>
          </Container>

          {/* CALENDAR  */}
          <CalendarElement />

          <div className="d-flex justify-content-between">
            <h4 className="mt-3 font-face-CinzelDecorative">Comments:</h4>

            <Button
              variant="outline-dark"
              className="font-face-CinzelDecorative align-self-center"
              onClick={handleShow}
            >
              Add comment
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="font-face-CinzelDecorative">
                  Aggiungi un commento!
                </Modal.Title>
              </Modal.Header>

              <Form className="mt-5" onSubmit={addComment}>
                <Form.Group controlId="blog-form" className="mt-3 d-none">
                  <Form.Label>Gdl</Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="Gdl"
                    required
                    name="gdl"
                    value={gdl}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="blog-category" className="mt-3 mx-3">
                  <Form.Label>Testo del commento</Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="Scrivi qui..."
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  ></Form.Control>
                </Form.Group>

                <Form.Group controlId="blog-category" className="mt-3 d-none">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    size="lg"
                    placeholder="User"
                    required
                    value={user}
                  ></Form.Control>
                </Form.Group>

                <Modal.Footer>
                  <Button
                    type="reset"
                    size="lg"
                    variant="outline-dark"
                    onClick={handleClose}
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
                    onClick={handleClose}
                  >
                    Invia
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </div>

          <Col className="d-flex justify-content-between">
            <Table striped bordered hover>
              <thead>
                <tr className="font-face-CinzelDecorative">
                  <th>User</th>
                  <th>Comment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment._id}>
                    <td>
                      {comment.user && (
                        <>
                          <Image
                            src={`${comment.user.avatar}`}
                            style={{ width: "30px" }}
                            roundedCircle
                          />{" "}
                          {`${comment.user.name} ${comment.user.surname}`}
                        </>
                      )}
                    </td>
                    <td>{`${comment.text}`}</td>
                    {comment.user && storedUserId === comment.user._id ? (
                      <td>
                        <Button
                          variant="outline-dark"
                          className="align-self-center me-3"
                          onClick={() => {
                            setCommentToDeleteId(comment._id);
                            handleShow2();
                          }}
                        >
                          <PencilFill />
                        </Button>
                        <Modal show={show2} onHide={handleClose2}>
                          <Modal.Header closeButton>
                            <Modal.Title className="font-face-CinzelDecorative">
                              Modifica il commento:
                            </Modal.Title>
                          </Modal.Header>
                          <Form className="mt-5" onSubmit={changeComment}>
                            <Form.Group
                              controlId="blog-category"
                              className="mt-3 mx-3"
                            >
                              <Form.Label>Testo del commento</Form.Label>
                              <Form.Control
                                size="lg"
                                placeholder="Scrivi qui..."
                                required
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                              ></Form.Control>
                            </Form.Group>
                            <Modal.Footer>
                              <Button
                                type="reset"
                                size="lg"
                                variant="outline-dark"
                                onClick={handleClose2}
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
                                onClick={handleClose2}
                              >
                                Invia
                              </Button>
                            </Modal.Footer>
                          </Form>
                        </Modal>

                        <Button
                          variant="outline-danger"
                          className="align-self-center"
                          onClick={() => deleteComment(comment._id)}
                        >
                          <Trash3 />
                        </Button>
                      </td>
                    ) : (
                      <td></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
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

export default GdlDetails;
