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
import { useNavigate, useParams, Link } from "react-router-dom";
import Creator from "../../components/Homepage-loggati/Cards/Creator.js";
import CalendarElement from "./Calendar.js";
import queryString from "query-string";
import "./GdlDetailsStyles.css";

// import BlogLike from "../../components/likes/BlogLike";
import { ToastContainer, toast } from "react-toastify";

const GdlDetails = ({}) => {
  const [gdlGet, setGdlGet] = useState(null);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState();
  const [gdl, setGdl] = useState("");
  const [text, setText] = useState("");
  const [user, setUser] = useState("");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [commentToDeleteId, setCommentToDeleteId] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [gdlId, setGdlId] = useState("");
  const [userId, setUserId] = useState("");
  const [gdls, setGdls] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [show3, setShow3] = useState(false);

  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);

  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = () => setShow4(true);
  const [category, setCategory] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPlot, setBookPlot] = useState("");
  const [readTime, setReadTime] = useState("");
  const [pages, setPages] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);

  const [show5, setShow5] = useState(false);

  const handleClose5 = () => setShow5(false);
  const handleShow5 = () => setShow5(true);

  const [show6, setShow6] = useState(false);

  const handleClose6 = () => setShow6(false);
  const handleShow6 = () => setShow6(true);

  const getGdl = async () => {
    try {
      // Ottieni i gdl dell'utente dal backend
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
        const userGdl = userData.gdlId || []; // Array dei gdl dell'utente
        setGdls(userGdl);
      }

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGdlGet(data);

      // Aggiorna editFormData con i nuovi dati da gdlGet
      setEditFormData({
        bookTitle: data?.bookTitle || "",
        bookAuthor: data?.bookAuthor || "",
        category: data?.category || "",
        bookPlot: data?.bookPlot || "",
        readTime: data?.readTime?.value || "",
        pages: data?.pages || "",
        deadline: data?.deadline || "",
      });
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
    // Recupera il valore di 'userId' dal localStorage al montaggio del componente
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

  const deleteComment = async (commentToDeleteId) => {
    if (commentToDeleteId) {
      let response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/comments/${commentToDeleteId}`,
        {
          method: "DELETE",
        }
      )
        .then((response) => {
          if (response.ok) {
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

  const partecipaAlGdl = async () => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserToken = localStorage.getItem("token");
    setLoading(true);

    try {
      // Ottieni i gdl dell'utente dal backend
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
        const userGdl = userData.gdlId || []; // Array dei gdl dell'utente
        setGdls(userGdl);
        console.log("userGdl is: ", userGdl);

        // Verifica se il gdl è già presente nell'array dei gdl dell'utente
        let isGdlAlreadyAdded = false;

        for (const userObj of userGdl) {
          for (const key in userObj) {
            if (userObj.hasOwnProperty(key) && userObj[key] === id) {
              isGdlAlreadyAdded = true;
              break;
            }
          }

          if (isGdlAlreadyAdded) {
            break;
          }
        }
        console.log(isGdlAlreadyAdded);
        if (!isGdlAlreadyAdded) {
          // Aggiungi il gdl all'array dei gdl dell'utente
          const newGdl = [...userGdl];
          newGdl.push(id);

          // Invia la richiesta di aggiornamento dei gdl dell'utente al backend
          const updateResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${storedUserId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + storedUserToken,
              },
              method: "PUT",
              body: JSON.stringify({ gdlId: newGdl }),
            }
          );

          if (updateResponse.ok) {
            // Aggiungi il gdl all'array events utilizzando push
            setGdl(newGdl);
            setGdlId(id);
            setIsFollowing(true);
          }

          toast("Gdl added to your dashboard successfully!", {
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
          // Il gdl è già presente nell'array dei gdl dell'utente
          toast.warn("Gdl is already added to your dashboard!", {
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
      } else {
      }

      /*INIZIA PROVA AGGIUNTA UTENTE CHE PARTECIPA AL GDL */
      // Ottieni gli utenti che partecipano al gdl dal backend
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`
      );

      if (response.ok) {
        const gdlData = await response.json();
        console.log(gdlData);
        const gdlUser = gdlData.userId || []; // Array dei gdl dell'utente
        console.log(gdlUser);

        // Verifica se l'utente è già presente nell'array degli utenti del gdl
        let isUserAlreadyAdded = false;

        for (const userObj of gdlUser) {
          for (const key in userObj) {
            if (userObj.hasOwnProperty(key) && userObj[key] === storedUserId) {
              isUserAlreadyAdded = true;
              break;
            }
          }

          if (isUserAlreadyAdded) {
            break;
          }
        }

        console.log("Type of storedUserId:", typeof storedUserId);
        console.log("Type of gdlUser:", gdlUser);

        console.log("isUserAlreadyAdded is:" + isUserAlreadyAdded);
        if (!isUserAlreadyAdded) {
          // Aggiungi l'utente all'array degli utenti del gdl
          const newUser = [...gdlUser];
          newUser.push(storedUserId);

          console.log("Before update - gdlUser:", gdlUser);
          console.log("Adding user:", storedUserId);

          // Invia la richiesta di aggiornamento degli utenti del gdl al backend
          const updatedResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              method: "PUT",
              body: JSON.stringify({ userId: newUser }),
            }
          );

          if (updatedResponse.ok) {
            // Aggiungi il gdl all'array events utilizzando push
            setUser(newUser);
          }

          setUserId(storedUserId);

          toast("User added to the gdl dashboard successfully!", {
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
          // L'utente è già presente nell'array dei gdl dell'utente
          toast.warn("User is already added to the gdl dashboard!", {
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
      } else {
      }
      /*FINE PROVA */
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const editCover = async () => {
    const formData = new FormData();
    formData.append("cover", file, "cover");

    try {
      let fileResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}/cover`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (fileResponse.ok) {
        const fileDataResponse = await fileResponse.json();

        setFile(formData);

        setTimeout(() => {
          window.location.href = `/gdl/${id}`;
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

  const [editFormData, setEditFormData] = useState({
    bookTitle: gdlGet?.bookTitle || "",
    bookAuthor: gdlGet?.bookAuthor || "",
    bookPlot: gdlGet?.bookPlot || "",
    category: gdlGet?.category || "",
    readTime: gdlGet?.readTime?.value || "",
    pages: gdlGet?.pages || "",
    deadline: gdlGet?.deadline || "",
  });

  const handleEditFormDataChange = (field, value) => {
    console.log("Campo:", field);
    console.log("Valore:", value);
    setEditFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
    console.log("Nuovo stato di editFormData:", editFormData);
  };

  const editGdl = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      user: user,
      category: editFormData.category,
      bookTitle: editFormData.bookTitle,
      bookAuthor: editFormData.bookAuthor,
      bookPlot: editFormData.bookPlot,
      readTime: {
        value: editFormData.readTime,
      },
      pages: editFormData.pages,
      deadline: editFormData.deadline,
    };

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(textData),
        }
      );

      if (textResponse.ok) {
        setEditFormData(textData);
        toast("Gdl edited successfully!", {
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

        const data = await textResponse.json();
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGdl = async (commentToDeleteId) => {
    let response = await fetch(
      `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${id}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          toast("Gdl deleted successfully!", {
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
            window.location.href = `/gdl`;
          }, 2000);
        } else {
          throw new Error("Something went wrong!");
        }
      })

      .catch((e) => console.error(e));
  };

  return (
    <>
      {loading ? (
        <Spinner animation="grow" variant="dark" className="spinner" />
      ) : (
        <>
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

                <Button
                  variant="dark"
                  className="font-face-CinzelDecorative align-self-center mt-3"
                  onClick={handleShow6}
                >
                  Edit Cover
                </Button>
                <Modal show={show6} onHide={handleClose6}>
                  <Form className="mt-3" onSubmit={editCover}>
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
                        onClick={handleClose6}
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
              </Container>

              <Col lg={6} className="mt-5">
                <h4 className="font-face-CinzelDecorative">Trama del libro:</h4>
                <div>{gdlGet?.bookPlot}</div>
                <hr></hr>

                <div className="blog-details-container mt-3">
                  <div className="blog-details-author">
                    <Link
                      to={
                        gdlGet?.user?._id === storedUserId
                          ? `/users/me/${storedUserId}`
                          : `/users/${gdlGet?.user?._id}`
                      }
                      className="gdl-link align-self-center"
                      style={{ color: "black" }}
                    >
                      <Creator {...gdlGet?.user} />
                    </Link>
                  </div>
                  <div className="blog-details-info mt-3">
                    <div className="d-flex">
                      <p className="font-face-CinzelDecorative align-self-center me-2">
                        Category:{" "}
                      </p>{" "}
                      <p className="align-self-center">{gdlGet?.category}</p>
                    </div>
                    <div className="d-flex">
                      <p className="font-face-CinzelDecorative align-self-center me-2">
                        Pages:{" "}
                      </p>{" "}
                      <p className="align-self-center">{gdlGet?.pages}</p>
                    </div>
                    <div className="d-flex">
                      <p className="font-face-CinzelDecorative me-2">
                        Reading time:{" "}
                      </p>{" "}
                      <p>{`${gdlGet?.readTime.value} ${gdlGet?.readTime.unit}`}</p>
                    </div>
                    <div className="d-flex">
                      <p className="font-face-CinzelDecorative me-2">
                        Deadline:{" "}
                      </p>{" "}
                      <p>{gdlGet?.deadline}</p>
                    </div>
                    <div
                      style={{
                        marginTop: 20,
                      }}
                    >
                      {/* <BlogLike defaultLikes={["123"]} onChange={console.log} /> */}
                    </div>
                  </div>
                  {gdls && gdls.some((gdl) => gdl._id === id) ? (
                    <Button
                      variant="dark"
                      className="font-face-CinzelDecorative align-self-center partecipiGià"
                      disabled
                    >
                      Already joined
                    </Button>
                  ) : (
                    <Button
                      variant="dark"
                      className="font-face-CinzelDecorative align-self-center"
                      onClick={isFollowing ? null : () => partecipaAlGdl(id)}
                    >
                      Join the GDL!
                    </Button>
                  )}

                  <Button
                    variant="dark"
                    className="font-face-CinzelDecorative align-self-center editGdl mx-3"
                    onClick={handleShow4}
                  >
                    Edit
                  </Button>
                  <Modal show={show4} onHide={handleClose4}>
                    <Modal.Header closeButton>
                      <Modal.Title className="font-face-CinzelDecorative align-self-center">
                        Edit the GDL
                      </Modal.Title>
                    </Modal.Header>

                    <Form className="mt-3" onSubmit={editGdl}>
                      <Form.Group controlId="blog-form" className="mt-3 mx-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Title"
                          required
                          value={editFormData.bookTitle}
                          onChange={(e) =>
                            handleEditFormDataChange(
                              "bookTitle",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>

                      <Form.Group controlId="blog-form" className="mt-3 mx-3">
                        <Form.Label>Author</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Author"
                          required
                          value={editFormData.bookAuthor}
                          onChange={(e) =>
                            handleEditFormDataChange(
                              "bookAuthor",
                              e.target.value
                            )
                          }
                        />
                      </Form.Group>

                      <Form.Group controlId="blog-form" className="mt-3 mx-3">
                        <Form.Label>Plot</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Plot"
                          required
                          value={editFormData.bookPlot}
                          onChange={(e) =>
                            handleEditFormDataChange("bookPlot", e.target.value)
                          }
                        />
                      </Form.Group>

                      <Form.Group
                        controlId="blog-category"
                        className="mt-3 mx-3"
                      >
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Category"
                          required
                          value={editFormData.category}
                          onChange={(e) =>
                            handleEditFormDataChange("category", e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group className="mt-3 mx-3">
                        <Form.Label>Reading time</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Control
                            size="lg"
                            placeholder="Reading time"
                            required
                            value={editFormData.readTime}
                            onChange={(e) =>
                              handleEditFormDataChange(
                                "readTime",
                                e.target.value
                              )
                            }
                          />
                          <span className="ms-2">hours</span>
                        </div>
                      </Form.Group>

                      <Form.Group
                        controlId="blog-category"
                        className="mt-3 mx-3"
                      >
                        <Form.Label>Pages</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Pages"
                          required
                          value={editFormData.pages}
                          onChange={(e) =>
                            handleEditFormDataChange("pages", e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>

                      <Form.Group
                        controlId="blog-category"
                        className="mt-3 mx-3"
                      >
                        <Form.Label>Deadline</Form.Label>
                        <Form.Control
                          size="lg"
                          placeholder="Deadline"
                          required
                          value={editFormData.deadline}
                          onChange={(e) =>
                            handleEditFormDataChange("deadline", e.target.value)
                          }
                        ></Form.Control>
                      </Form.Group>

                      <Modal.Footer>
                        <Button
                          variant="secondary"
                          onClick={handleClose4}
                          className="font-face-CinzelDecorative align-self-center"
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          className="font-face-CinzelDecorative editGdl"
                          type="submit"
                        >
                          Save Changes
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Modal>

                  <Button
                    variant="danger"
                    className="font-face-CinzelDecorative align-self-center"
                    onClick={handleShow5}
                  >
                    Delete
                  </Button>
                  <Modal show={show5} onHide={handleClose5}>
                    <Modal.Header closeButton>
                      <Modal.Title className="font-face-CinzelDecorative align-self-center">
                        Delete the GDL
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to delete it?</Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="font-face-CinzelDecorative align-self-center"
                        variant="secondary"
                        onClick={handleClose5}
                      >
                        Close
                      </Button>
                      <Button
                        className="font-face-CinzelDecorative align-self-center"
                        variant="danger"
                        onClick={deleteGdl}
                      >
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Col>
            </Container>

            <Container className="p-0">
              <h4 className="font-face-CinzelDecorative mt-5">
                Participants:{" "}
                <Button variant="dark" onClick={handleShow3}>
                  <b>{gdlGet?.userId?.length}</b>
                </Button>
              </h4>
              <Col className="d-flex usersPartecipanti">
                <Modal show={show3} onHide={handleClose3}>
                  <Modal.Header closeButton>
                    <Modal.Title className="font-face-CinzelDecorative my-3">
                      Participants:
                    </Modal.Title>
                  </Modal.Header>
                  {gdlGet?.userId?.map((user, index) => (
                    <>
                      <Modal.Body className="d-flex">
                        <Link
                          to={
                            user._id === storedUserId
                              ? `/users/me/${storedUserId}`
                              : `/users/${user._id}`
                          }
                          className="gdl-link align-self-center"
                        >
                          <Image
                            className="cover align-self-center my-3 me-2"
                            src={user.avatar}
                            fluid
                            style={{ width: "100px" }}
                          />
                        </Link>
                        <p
                          className="align-self-center font-face-CinzelDecorative ms-3"
                          key={index}
                        >
                          {user.name} {user.surname}
                        </p>
                      </Modal.Body>
                    </>
                  ))}
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleClose3}
                      className="font-face-CinzelDecorative my-3"
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
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
                    Add a comment!
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
                    <Form.Label>Comment text</Form.Label>
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
                                Update the comment:
                              </Modal.Title>
                            </Modal.Header>
                            <Form className="mt-5" onSubmit={changeComment}>
                              <Form.Group
                                controlId="blog-category"
                                className="mt-3 mx-3"
                              >
                                <Form.Label>Comment text</Form.Label>
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
                                  Submit
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
        </>
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
