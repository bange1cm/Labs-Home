import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { Link, useNavigate } from "react-router-dom";
import { useDownloadAssignment } from "../hooks/useDownloadAssignment";

function Download() {
    const navigate = useNavigate();
    const {downloading, error, currentAssignment} = useDownloadAssignment();


    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Finish Assignment</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <>{error ? (
                <>
                <Row>
                    <Col>
                    <h1 className="pb-4 text-danger">Failed to Save</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="px-5">
                            There was an error trying to save assignment{" "}
                            {currentAssignment ?? "?"} in your Downloads folder.  
                            Please check the{" "}
                            <Link to="/activity-log">Activity Log</Link> for more details.
                        </p>
                        <p className="px-5 text-muted small">
                            Error details: <code>{error}</code>
                        </p>
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
            ) : downloading ? (
                <Row>
                    <Col>
                        <h1 className="pb-4">Saving Assignment {currentAssignment ?? "Loading..."}</h1>
                    </Col>
                </Row>
            ) : (
                <>
                <Row>
                    <Col>
                        <h1 className="pb-4">Assignment {currentAssignment ?? "Loading..."} Saved</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="px-5">
                        <h6 style={{fontSize: "1.25rem"}}>
                            The assignment file has been saved in your Downloads folder. It is ready for submission to your professor. 
                        </h6>
                        <h6 style={{fontSize: "1.25rem"}}>
                            You can now <Link to="/upload">upload the professor's starting file</Link> for Assignment {currentAssignment != null ? currentAssignment + 1 : "Loading..."}.
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
            )}</>
        </Container>
    );
}

export default Download;