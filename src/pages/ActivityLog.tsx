import {Container, Row, Col} from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import ActivityTable from "../components/ActivityTable";

function ActivityLog() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/help">Help</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">View Activity Log</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">Activity Log</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <ActivityTable />
                </Col>
            </Row>
            <Row>
                <Col className="pt-5 px-5">
                <TwoButtonRow 
                rightButtonText="Dismiss"
                rightButtonOnClick={() => navigate("/help")}
                />
                </Col>
            </Row>
        </Container>
       
       
    );
}

export default ActivityLog;