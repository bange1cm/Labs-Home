import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import LinkButton from "../components/LinkButton";
import { useNavigate } from "react-router-dom";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";
import { useEffect } from "react";



function Home() {
    const navigate = useNavigate();
    const {currentAssignment, loadAssignment} = useAssignmentCounter();

    useEffect(() => {
        loadAssignment();
    }, []);

    return(
        <Container>
            <Row>
                <Col className="py-4">
                    <h1>Current Assignment: Assignment {currentAssignment ?? "Loading..."}</h1>
                    <h2><LinkButton onClick={() => navigate("/launch")}>Launch</LinkButton> Assignment</h2>
                    <h2><LinkButton onClick={() => navigate("/download")}>Download</LinkButton> Assignment File</h2>
                </Col>
            </Row>
            <Row>
                <Col className="py-4">
                    <h1>Next Assignment: Assignment {currentAssignment != null ? currentAssignment + 1 : "Loading..."}</h1>
                    <h2><LinkButton onClick={() => navigate("/upload")}>Upload</LinkButton> Starting File</h2>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;