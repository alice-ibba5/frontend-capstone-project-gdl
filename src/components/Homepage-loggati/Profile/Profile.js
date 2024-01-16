import { Container, Image, Spinner, Col, Button, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import CalendarElement from "../Profile/CalendarXProfile/CalendarXprofile.js";
import "./styles.css";

const Profile = () => {
  const storedUserId = localStorage.getItem("userId");
  const storedUserToken = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const [isMounted, setIsMounted] = useState(true);

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
            <Col lg={6} className="mt-5">
              <Image
                className="avatar align-item-center"
                src={user.avatar}
                fluid
                style={{ width: "200px" }}
              />
            </Col>
            <Col lg={6} className="mt-5">
              <h5 className="font-face-CinzelDecorative">Email: </h5>
              <p>{user.email}</p>
              <h5 className="font-face-CinzelDecorative">Data di nascita: </h5>
              <p>{user.dateOfBirth}</p>
            </Col>
          </Container>
          <Container className="container-gdl">
            <h4 className="font-face-CinzelDecorative my-5">
              GDL a cui partecipi:{" "}
            </h4>
            <Container className="d-flex flex-row">
              {user?.gdlId?.map((gdl, index) => (
                <>
                  <Col lg={3} className="d-flex flex-column">
                    <Image
                      className="cover align-self-center mb-3"
                      src={gdl.cover}
                      fluid
                      style={{ width: "100px" }}
                    />
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

          {/* CALENDAR  */}
          <CalendarElement />
        </Container>
      )}
    </>
  );
};

export default Profile;
