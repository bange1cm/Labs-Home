import {Container, Row, Col} from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import WarningMessage from "../components/WarningMessage";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";
import { useEffect } from "react";

function RestartAssignment() {
    const navigate = useNavigate();
    const {currentAssignment, loadAssignment} = useAssignmentCounter();

    useEffect(() => {
        loadAssignment();
    }, []);

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/help">Help</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Restart Current Assignment</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">Restart Assignment {1}</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <WarningMessage>
                        Warning: if you restart, you will return to the starting file and lose all changes for Assignment {currentAssignment ?? "Loading..."}.
                        <br /><h6 className="pt-2"><i>This action cannot be undone</i></h6>
                    </WarningMessage>
                </Col>
            </Row>
            <Row>
                <Col className="pt-5 px-5">
                <TwoButtonRow 
                leftButtonText="Restart"
                leftButtonOnClick={() => console.log("restart")}
                rightButtonText="Cancel"
                rightButtonOnClick={() => navigate("/help")}
                />
                </Col>
            </Row>
        </Container>
       
       
    );
}

export default RestartAssignment;