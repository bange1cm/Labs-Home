import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    return (
        <Container fluid>
            <Row className='align-items-center border-bottom py-4 mb-4 border-3' style={{ borderColor: "#666666" }}>
                <Col>
                    <h1 style={{lineHeight: "2rem" }}><a href='/' style={{ color: "#212529bf", textDecoration: "none" }}>Labs@Home</a></h1>
                </Col>
                <Col>
                    <Button
                        variant="outline-primary"
                        style={{ 
                            float: 'right',
                            borderRadius: "50%",
                            borderWidth: "0.125rem",
                            width: "2.5rem",
                            height: "2.5rem",
                            padding: 0,
                            fontWeight: "bold",
                            fontSize: "2rem",
                            lineHeight: "2rem",
                        }}
                        onClick={() => navigate("/help")}
                    >?</Button>
                </Col>
            </Row>
        </Container>

    );
}

export default Header;

// come back and use Navbar component from react-bootstrap?