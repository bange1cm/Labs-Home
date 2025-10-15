import {Container, Row, Col} from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import WarningMessage from "../components/WarningMessage";

function ResetAll() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/help">Help</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Reset Labs@Home</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">Reset Labs@Home</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <WarningMessage>
                        Warning: if you reset, you will lose all changes made in Labs@Home.
                        <br />  All starting files and assignment work will be deleted.
                        <br /><h6 className="pt-2"><i>This action cannot be undone</i></h6>
                    </WarningMessage>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <h5>Use when</h5>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <ul>
                        <li>Starting files are uploaded in the wrong order</li>
                        <li>Or as a last resort for other errors</li>
                    </ul>
                </Col>
            </Row>
            <Row>
                <Col>
                <TwoButtonRow 
                leftButtonText="Reset"
                leftButtonOnClick={() => console.log("reset")}
                rightButtonText="Cancel"
                rightButtonOnClick={() => navigate("/help")}
                />
                </Col>
            </Row>
        </Container>
       
       
    );
}

export default ResetAll;