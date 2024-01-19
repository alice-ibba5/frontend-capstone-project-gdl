import { Container, Image, Spinner, Col } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const OtherProfile = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const [isMounted, setIsMounted] = useState(true);
  const { userId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/users/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + storedUserToken,
            },
          }
        );

        if (isMounted && userResponse.ok) {
          const data = await userResponse.json();
          console.log("data is:", data);
          setUser(data);

          console.log("userId is:", userId);
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
  }, [userId, storedUserToken, isMounted]);

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
              <h5 className="font-face-CinzelDecorative mt-3">Email: </h5>
              <p>{user?.email}</p>
            </Col>
            <Col lg={6} className="mt-5"></Col>
          </Container>
          <hr></hr>
          <Container className="container-gdl p-0">
            <h4 className="font-face-CinzelDecorative my-3">
              GDL a cui partecipa:{" "}
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
        </Container>
      )}
    </>
  );
};

export default OtherProfile;
