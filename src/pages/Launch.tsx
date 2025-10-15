import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate } from "react-router-dom";
import LoginHintCard from "../components/LoginHintCard";

function Launch() {
    const navigate = useNavigate();

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
            <Row>
                <Col>
                    <h1 className="pb-4">Launching Assignment {1} in a new terminal</h1>
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
                    <h6><i>Close terminal when done</i></h6>
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
        </Container>
    );
}

export default Launch;