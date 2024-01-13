import { useState, useEffect } from "react";
import { Button, Form, Container } from "react-bootstrap";

import { Navigate, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";
import "react-toastify/dist/ReactToastify.css";

function NuovaProposta() {
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPlot, setBookPlot] = useState("");
  const [readTime, setReadTime] = useState("");
  const [pages, setPages] = useState("");
  const [deadline, setDeadline] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      user: user,
      category: category,
      bookTitle: bookTitle,
      bookAuthor: bookAuthor,
      bookPlot: bookPlot,
      readTime: {
        value: readTime,
      },
      pages: pages,
      deadline: deadline,
    };

    const formData = new FormData();
    formData.append("cover", file, "cover");

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl`,
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
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl/${_id}/cover`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (fileResponse.ok) {
          toast("Gdl created successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          const fileDataResponse = await fileResponse.json();
          console.log(fileDataResponse);

          setFile(formData);

          setTimeout(() => {
            window.location.href = "/gdl";
          }, 2000);
        } else {
          throw new Error(`HTTP error! Status: ${fileResponse.status}`);
        }
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    // getPosts();
  };

  useEffect(() => {
    // Recupera il valore di 'authorId' dal localStorage al montaggio del componente
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser(storedUserId);
    }
  }, []);

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            required
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Autore</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Author"
            required
            value={bookAuthor}
            onChange={(e) => setBookAuthor(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Trama</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Plot"
            required
            value={bookPlot}
            onChange={(e) => setBookPlot(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="blog-form" className="mt-3 d-none">
          <Form.Label>User ID</Form.Label>
          <Form.Control
            size="lg"
            placeholder="2348762397429"
            required
            value={user}
          />
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Category"
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Cover</Form.Label>
          <div>
            <input
              type="file"
              //value={file}
              multiple={false}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
        </Form.Group>

        <Form.Group className="mt-3">
          <Form.Label>Tempo di lettura</Form.Label>
          <div className="d-flex align-items-center">
            <Form.Control
              size="lg"
              placeholder="3"
              required
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              style={{
                width: 50,
              }}
            />
            <span className="ms-2">ore</span>
          </div>
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>N. pagine</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Pages"
            required
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="blog-category" className="mt-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            size="lg"
            placeholder="gg/mm/aaaa"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{
              marginLeft: "1em",
            }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>

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
    </Container>
  );
}

export default NuovaProposta;
