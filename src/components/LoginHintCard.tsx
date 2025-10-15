import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LoginHintCard: React.FC = () => {
  return (
    <Card
      className="p-3 mb-4"
      style={{
        border: "2px solid #A9B2BA",
        borderRadius: "1rem",
        maxWidth: "350px",
      }}
    >
      <Row className="mb-2">
        <Col className="text-end pe-2">
          <span className="fw-semibold">localhost login</span>
        </Col>
        <Col className="text-start ps-2">
          <span>root</span>
        </Col>
      </Row>

      <Row>
        <Col className="text-end pe-2">
          <span className="fw-semibold">Password</span>
        </Col>
        <Col className="text-start ps-2">
          <span>cnets</span>
        </Col>
      </Row>
    </Card>
  );
};

export default LoginHintCard;
