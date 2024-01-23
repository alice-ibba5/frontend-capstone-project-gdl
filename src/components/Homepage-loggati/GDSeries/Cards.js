import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Creator from "../Cards/Creator.js";
import "./CardsStyles.css";

const GdSeries = (props) => {
  const { title, cover, user, _id, userId } = props;
  return (
    <Link to={`/gdSeries/${_id}`} className="gdl-link">
      <Card
        className="gdl-card"
        style={{
          width: "200px",
          height: "550px",
        }}
      >
        <div
          className="gdl-background"
          style={{
            backgroundImage: `url(${cover})`,
          }}
        ></div>
        <Card.Img
          variant="top"
          src={cover}
          className="gdl-cover"
          style={{ width: "200px" }}
        />
        <Card.Body>
          <Card.Title className="font-face-CinzelDecorative">
            {title}
          </Card.Title>

          <p>
            Participants: <b>{userId.length}</b>
          </p>
        </Card.Body>
        <Card.Footer>
          <Creator {...user} />
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default GdSeries;
