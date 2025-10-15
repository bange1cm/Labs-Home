import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LinkButton from "../components/LinkButton";
import { useNavigate } from "react-router-dom";



function Home() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col className="py-4">
                    <h1>Current Assignment: Assignment {1}</h1>
                    <h2><LinkButton onClick={() => navigate("/launch")}>Launch</LinkButton> Assignment</h2>
                    <h2><LinkButton onClick={() => navigate("/download")}>Download</LinkButton> Assignment File</h2>
                </Col>
            </Row>
            <Row>
                <Col className="py-4">
                    <h1>Next Assignment: Assignment {2}</h1>
                    <h2><LinkButton onClick={() => navigate("/upload")}>Upload</LinkButton> Starting File</h2>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;