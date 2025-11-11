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
                    <h3><LinkButton onClick={() => navigate("/launch")}>Launch</LinkButton> Assignment</h3>
                    <h3><LinkButton onClick={() => navigate("/download")}>Finish</LinkButton> Assignment</h3>
                </Col>
            </Row>
            <Row>
                <Col className="py-4">
                    <h1>Next Assignment: Assignment {currentAssignment != null ? currentAssignment + 1 : "Loading..."}</h1>
                    <h3><LinkButton onClick={() => navigate("/upload")}>Upload</LinkButton> Professor's Starting File</h3>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;