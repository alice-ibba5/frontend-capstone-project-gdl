import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Creator from "./Creator.js";

const Gdl = (props) => {
  const { bookTitle, cover, user, _id, deadline } = props;
  return (
    <Link to={`/gdl/${_id}`} className="gdl-link">
      <Card className="gdl-card" style={{ width: "200px" }}>
        <Card.Img
          variant="top"
          src={cover}
          className="gdl-cover"
          style={{ width: "200px" }}
        />
        <Card.Body>
          <Card.Title className="font-face-CinzelDecorative">
            {bookTitle}
          </Card.Title>
          <p>Deadline: {deadline}</p>
        </Card.Body>
        <Card.Footer>
          <Creator {...user} />
        </Card.Footer>
      </Card>
    </Link>
  );
};

export default Gdl;
