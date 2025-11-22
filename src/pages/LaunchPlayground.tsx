import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate } from "react-router-dom";
import LoginHintCard from "../components/LoginHintCard";
import { usePlaygroundLaunch } from "../hooks/usePlaygroundLaunch";

function LaunchPlayground() {
  const navigate = useNavigate();
  const { launching, error } = usePlaygroundLaunch();

  return (
    <Container>
      <Row>
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/playground">Playground</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Launch Playground
              </li>
            </ol>
          </nav>
        </Col>
      </Row>
      <>
        {error ? (
          <>
            <Row>
              <Col>
                <h1 className="pb-4 text-danger">Failed to Launch</h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="px-5">
                  There was an error trying to launch the playground.
                </p>
                <p className="px-5 text-muted small">
                  Error details: <code>{error}</code>
                </p>
              </Col>
            </Row>
            <Row>
              <Col className="pt-5">
                <TwoButtonRow
                  rightButtonText="Dismiss"
                  rightButtonOnClick={() => navigate("/playground")}
                />
              </Col>
            </Row>
          </>
        ) : launching ? (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">Launching Playground in a new terminal</h1>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <LoginHintCard />
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <h6>
                  <i>Password will be hidden when typing</i>
                </h6>
              </Col>
            </Row>
            <Row>
              <Col className="px-5 pb-4">
                <h6>
                  <i>
                    Close terminal when done. You will then be able to return to
                    the main menu.
                  </i>
                </h6>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">Playground Closed</h1>
              </Col>
            </Row>
            <Row className="pt-5">
              <Col className="pt-5 px-5">
                <TwoButtonRow
                  rightButtonText="Dismiss"
                  rightButtonOnClick={() => navigate("/playground")}
                />
              </Col>
            </Row>
          </>
        )}
      </>
    </Container>
  );
}

export default LaunchPlayground;
