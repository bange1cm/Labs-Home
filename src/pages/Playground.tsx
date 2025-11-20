import { Container, Row, Col } from "react-bootstrap";
import LinkButton from "../components/LinkButton";
import { useNavigate } from "react-router-dom";

function Playground() {
  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <Col className="py-4">
          <h1>Playground</h1>
          <h3>
            <LinkButton onClick={() => navigate("/launch-playground")}>
              Launch
            </LinkButton>{" "}
            Playground
          </h3>
          <h3>
            <LinkButton onClick={() => navigate("/reset-playground")}>
              Reset
            </LinkButton>{" "}
            Playground
          </h3>
        </Col>
      </Row>
    </Container>
  );
}

export default Playground;
