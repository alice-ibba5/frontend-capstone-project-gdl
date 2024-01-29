import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Creator from "./Creator.js";
import "./GdlStyles.css";

const Gdl = (props) => {
  const { bookTitle, cover, user, _id, deadline, userId } = props;
  return (
    <Link to={`/gdl/${_id}`} className="gdl-link">
      <Card className="gdl-card">
        <Card.Img variant="top" src={cover} className="gdl-cover" />
        <div
          className="gdl-background"
          style={{
            backgroundImage: `url(${cover})`,
          }}
        ></div>
        <Card.Body>
          <Card.Title className="font-face-CinzelDecorative">
            {bookTitle}
          </Card.Title>
          <p>Deadline: {deadline}</p>
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

export default Gdl;
