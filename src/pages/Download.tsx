import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate } from "react-router-dom";

function Download() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Download Assignment File</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">Download Assignment {1} and Submit it to Blackboard</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5 pb-5">
                    <h6><i>Do not save the file within Labs@Home</i></h6>
                </Col>
            </Row>
            <Row>
                <Col className="pt-5">
                    <TwoButtonRow 
                    leftButtonText="Download"
                    leftButtonOnClick={() => console.log("download")}
                    rightButtonText="Cancel"
                    rightButtonOnClick={() => navigate("/")}
                    />
                </Col>
            </Row>
        
        </Container>
    );
}

export default Download;