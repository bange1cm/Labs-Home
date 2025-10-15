import { Col, Container, Row } from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate } from "react-router-dom";
import LinkButton from "../components/LinkButton";

function HelpHome() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Help</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row><h1><LinkButton onClick={() => navigate("/work-explanation")}>How Labs@Home Works</LinkButton></h1></Row>
            <Row><h1><LinkButton onClick={() => navigate("/activity-log")}>View Activity Log</LinkButton></h1></Row>
            <Row><h1><LinkButton onClick={() => navigate("/restart-assignment")}>Restart Current Assignment</LinkButton></h1></Row>
            <Row><h1><LinkButton onClick={() => navigate("/reset-all")}>Reset Labs@Home</LinkButton></h1></Row>
            <Row><h1><LinkButton onClick={() => navigate("/more-help")}>Need More Help?</LinkButton></h1></Row>
            <TwoButtonRow
                rightButtonText="Dismiss"
                rightButtonOnClick={() => navigate("/")}
                />
        </Container>
    );
}

export default HelpHome;