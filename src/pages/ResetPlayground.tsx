import { Container, Row, Col } from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import WarningMessage from "../components/WarningMessage";
import { resetPlayground } from "../hooks/resetPlayground";
import { useState } from "react";
import Spinner from "react-bootstrap/Spinner";

function ResetPlayground() {
  const navigate = useNavigate();
  const { reseted, error, reset } = resetPlayground();
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setLoading(true);
    reset();
  };

  return (
    <Container>
      <Row>
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/playground">Playground</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Reset Playground
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
                <h1 className="pb-4 text-danger">
                  Failed to Reset the Playground
                </h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="px-5">
                  There was an error trying to reset the Playground.
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
        ) : reseted ? (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">Successfully Reset Playground</h1>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <h6 style={{ fontSize: "1.25rem" }}>
                  All the Playground changes have been been deleted.
                </h6>
              </Col>
            </Row>
            <Row>
              <Col className="pt-5 px-5">
                <TwoButtonRow
                  rightButtonText="Dismiss"
                  rightButtonOnClick={() => navigate("/playground")}
                />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">Reset Playground</h1>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <WarningMessage>
                  Warning: if you reset, you will lose all changes made in the
                  Playground.
                  <br />
                  <h6 className="pt-2">
                    <i>This action cannot be undone.</i>
                  </h6>
                </WarningMessage>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <h6 className="pt-2 pb-2">
                  <i>Assignment work will not be reset.</i>
                </h6>
              </Col>
            </Row>
            {!loading ? (
              <Row>
                <Col className="px-5 pt-4">
                  <TwoButtonRow
                    leftButtonText="Reset"
                    leftButtonOnClick={() => handleReset()}
                    rightButtonText="Cancel"
                    rightButtonOnClick={() => navigate("/playground")}
                  />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col className="px-5 pt-4">
                  <Spinner
                    animation="border"
                    variant="primary"
                    role="status"
                    className="mt-4"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </Col>
              </Row>
            )}
          </>
        )}
      </>
    </Container>
  );
}

export default ResetPlayground;
