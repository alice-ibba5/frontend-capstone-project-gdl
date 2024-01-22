import { useState, useEffect } from "react";
import { Button, Form, Container, Image } from "react-bootstrap";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import queryString from "query-string";
import "react-toastify/dist/ReactToastify.css";

function NuovoGDSeries() {
  const [blog, setBlog] = useState();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [books, setBooks] = useState([]);
  const [file, setFile] = useState(null);
  const [gdl, setGdl] = useState([]);
  const navigate = useNavigate();
  const [selectedBooks, setSelectedBooks] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const textData = {
      user: user,
      category: category,
      title: title,
      books: books,
    };

    const formData = new FormData();
    formData.append("cover", file, "cover");

    try {
      let textResponse = await fetch(
        `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdSeries`,
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
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdSeries/${_id}/cover`,
          {
            method: "PATCH",
            body: formData,
          }
        );

        if (fileResponse.ok) {
          toast("GDSeries created successfully!", {
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
            window.location.href = "/gdSeries";
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
  };

  useEffect(() => {
    // Recupera il valore di 'userId' dal localStorage al montaggio del componente
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUser(storedUserId);
    }
  }, []);

  useEffect(() => {
    const getGdl = async () => {
      setLoading(true);
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdl`,
          {
            method: "GET",
            mode: "cors",
          }
        );

        if (response.ok) {
          let data = await response.json();
          setGdl(data);

          setLoading(false);
        } else {
          console.log("error");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    if (gdl.length === 0) {
      getGdl();
    }
  }, [gdl.length]);

  const handleSelectChange = (e) => {
    // Ottieni tutti gli elementi selezionati dall'opzione
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedBooks(selectedOptions);
    setBooks(selectedOptions);
  };

  return (
    <Container className="new-blog-container">
      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-form" className="mt-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
          <Form.Label>Category</Form.Label>
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

        <Form.Select
          aria-label="Default select example"
          multiple={true}
          className="mt-3"
          value={selectedBooks}
          onChange={handleSelectChange}
        >
          {gdl?.map((gdl, i) => {
            return (
              <option value={gdl._id}>
                <Image src={gdl.cover} fluid style={{ width: "20px" }} />
                {gdl.bookTitle}
              </option>
            );
          })}
        </Form.Select>

        <Form.Group className="mt-3">
          <Form.Label>Il libro non è presente?</Form.Label>
          <Link to={"/nuova-proposta"}>
            <Button
              variant="dark"
              className="font-face-CinzelDecorative ms-3"
              style={{
                backgroundColor: "#B68FB2",
                borderColor: "#B68FB2",
              }}
            >
              Add a book!
            </Button>
          </Link>
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button
            type="reset"
            size="lg"
            variant="outline-dark"
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
          >
            Submit
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

export default NuovoGDSeries;
