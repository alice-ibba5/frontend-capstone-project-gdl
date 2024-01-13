import React from "react";
import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import Gdl from "./Cards/Gdl.js";
import Spinner from "react-bootstrap/Spinner";
import "./HomeLogStyles.css";

const GdlList = ({ searchQuery }) => {
  const [gdl, setGdl] = useState([]);
  const [loading, setLoading] = useState(true);

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
          console.log(data);
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

  return (
    <Container>
      {loading ? (
        <Spinner animation="grow" variant="dark" className="spinner" />
      ) : (
        <Row className="mt-3">
          {gdl
            ?.filter((b) =>
              b.bookTitle?.toLowerCase().includes(searchQuery?.toLowerCase())
            )
            .map((gdl, i) => {
              return (
                <Col
                  key={`item-${i}`}
                  xl={2}
                  lg={3}
                  md={4}
                  sm={6}
                  style={{
                    marginBottom: 50,
                  }}
                >
                  <Gdl key={gdl.bookTitle} {...gdl} />
                </Col>
              );
            })}
        </Row>
      )}
    </Container>
  );
};

export default GdlList;
