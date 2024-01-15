import React from "react";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        color: "#B68FB2",
      }}
    >
      <Container>{`${new Date().getFullYear()} - © GDLove | Developed for book lovers.`}</Container>
    </footer>
  );
};

export default Footer;
