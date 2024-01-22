import "./styles.css";
import React from "react";
import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import GdSeries from "./Cards.js";
import Spinner from "react-bootstrap/Spinner";

const GdSeriesList = () => {
  const [gdSeries, setGdSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const getGdSeries = async () => {
      setLoading(true);
      try {
        let response = await fetch(
          `${process.env.REACT_APP_BACKEND_ENDPOINT}/api/gdSeries`,
          {
            method: "GET",
            mode: "cors",
          }
        );

        if (response.ok) {
          let data = await response.json();
          setGdSeries(data);
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
    if (gdSeries.length === 0) {
      getGdSeries();
    }
  }, [gdSeries.length]);

  return (
    <Container>
      {loading ? (
        <Spinner animation="grow" variant="dark" className="spinner" />
      ) : (
        <Row className="mt-3">
          {gdSeries
            ?.filter((b) =>
              b.title?.toLowerCase().includes(searchQuery?.toLowerCase())
            )
            .map((gdSeries, i) => {
              return (
                <Col
                  key={`item-${i}`}
                  xl={2}
                  lg={3}
                  md={4}
                  sm={6}
                  xs={6}
                  style={{
                    marginBottom: 50,
                  }}
                >
                  <GdSeries key={gdSeries.title} {...gdSeries} />
                </Col>
              );
            })}
        </Row>
      )}
    </Container>
  );
};

export default GdSeriesList;
