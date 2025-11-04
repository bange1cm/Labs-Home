import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import LoginHintCard from "../components/LoginHintCard";
import { useQemuLaunch } from "../hooks/useQemuLaunch";


function Launch() {
    const navigate = useNavigate();
    const {launching, error, currentAssignment} = useQemuLaunch();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Launch Assignment</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <>{error ? (
                <>
                <Row>
                    <Col>
                    <h1 className="pb-4 text-danger">Failed to Launch</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="px-5">
                            There was an error trying to launch assignment{" "}
                            {currentAssignment ?? "?"}.  
                            Please check the{" "}
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
                            rightButtonOnClick={() => navigate("/")}
                            />
                        </Col>
                    </Row>
                </>
                ) : launching ? (
                    <>
                    <Row>
                        <Col>
                            <h1 className="pb-4">Launching Assignment {currentAssignment ?? "Loading..."} in a new terminal</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5">
                            <LoginHintCard />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5">
                            <h6><i>Password will be hidden when typing</i></h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5 pb-4">
                            <h6><i>Close terminal when done. You will then be able to return to the main menu.</i></h6>
                        </Col>
                    </Row>
                    </>
                ) : (
                    <>
                    <Row>
                        <Col>
                            <h1 className="pb-4">Assignment {currentAssignment ?? "Loading..."} Closed</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="pt-5">
                            <TwoButtonRow 
                            rightButtonText="Dismiss"
                            rightButtonOnClick={() => navigate("/")}
                            />
                        </Col>
                    </Row>
                    </>
                )}
            </>
        </Container>
    );
}

export default Launch;