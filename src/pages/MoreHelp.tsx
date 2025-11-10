import {Container, Row, Col} from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";

function MoreHelp() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/help">Help</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Need More Help?</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">If you need more help, contact your professor.</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <h3>Professor Seeling</h3>
                    <h3>Email: <Link to="mailto:seeli1p@cmich.edu">seeli1p@cmich.edu</Link></h3>
                </Col>
            </Row>
            <Row>
                <Col className="px-5 pt-5">
                <TwoButtonRow 
                rightButtonText="Dismiss"
                rightButtonOnClick={() => navigate("/help")}
                />
                </Col>
            </Row>
        </Container>
       
       
    );
}

export default MoreHelp;