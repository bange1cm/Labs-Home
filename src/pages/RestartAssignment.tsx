import { Container, Row, Col } from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import WarningMessage from "../components/WarningMessage";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";
import { useEffect, useState } from "react";
import { restartAssignment } from "../hooks/restartAssignment";
import Spinner from "react-bootstrap/Spinner";

function RestartAssignment() {
  const navigate = useNavigate();
  const { currentAssignment, loadAssignment } = useAssignmentCounter();
  const { restarted, error, restart } = restartAssignment();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAssignment();
  }, []);

  const handleRestart = () => {
    setLoading(true);
    restart();
  };

  return (
    <Container>
      <Row>
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/help">Help</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Restart Current Assignment
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
                  Failed to Restart Assignment
                </h1>
              </Col>
            </Row>
            <Row>
              <Col>
                <p className="px-5">
                  There was an error trying to restart assignment{" "}
                  {currentAssignment ?? "Loading..."}. Please check the{" "}
                  <Link to="/activity-log">Activity Log</Link> for more details.
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
                  rightButtonOnClick={() => navigate("/help")}
                />
              </Col>
            </Row>
          </>
        ) : restarted ? (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">
                  Successfully Restarted Assignment{" "}
                  {currentAssignment ?? "Loading..."}
                </h1>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <h6 style={{ fontSize: "1.25rem" }}>
                  All changes for Assignment {currentAssignment} have been
                  deleted.
                </h6>
              </Col>
            </Row>
            <Row>
              <Col className="pt-5 px-5">
                <TwoButtonRow
                  rightButtonText="Dismiss"
                  rightButtonOnClick={() => navigate("/")}
                />
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col>
                <h1 className="pb-4">Restart Assignment {currentAssignment}</h1>
              </Col>
            </Row>
            <Row>
              <Col className="px-5">
                <WarningMessage>
                  Warning: if you restart, you will return to the starting file
                  and lose all changes for Assignment{" "}
                  {currentAssignment ?? "Loading..."}.
                  <br />
                  <h6 className="pt-2">
                    <i>This action cannot be undone</i>
                  </h6>
                </WarningMessage>
              </Col>
            </Row>
            {!loading ? (
              <Row>
                <Col className="px-5 pt-4">
                  <TwoButtonRow
                    leftButtonText="Restart"
                    leftButtonOnClick={() => handleRestart()}
                    rightButtonText="Cancel"
                    rightButtonOnClick={() => navigate("/help")}
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

export default RestartAssignment;
