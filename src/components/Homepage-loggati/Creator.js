import React from "react";
import { Col, Image, Row } from "react-bootstrap";

const Creator = (props) => {
  const { name, avatar, surname } = props;
  return (
    <Row>
      <Col xs={"auto"} className="pe-0">
        <Image
          className="gdl-creator"
          src={avatar}
          roundedCircle
          style={{ width: "30px" }}
        />
      </Col>
      <Col className="d-flex align-items-center">
        <span className="me-2">di </span>
        <h6 className="mt-2 font-face-CinzelDecorative">
          {name} {surname}
        </h6>
      </Col>
    </Row>
  );
};

export default Creator;
