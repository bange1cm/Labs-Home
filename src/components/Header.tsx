import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("labs");

  // Sync active tab with current route
  useEffect(() => {
    if (location.pathname.startsWith("/playground")) {
      setActiveKey("playground");
    } else {
      setActiveKey("labs");
    }
  }, [location.pathname]);

  const handleTabSelect = (key: string | null) => {
    if (key === "labs") {
      navigate("/");
      setActiveKey("labs");
    } else if (key === "playground") {
      navigate("/playground");
      setActiveKey("playground");
    }
  };

  return (
    <Container fluid>
      <Row className="align-items-center py-4">
        <Col>
          <Tabs
            activeKey={activeKey}
            onSelect={handleTabSelect}
            className="mb-0"
          >
            <Tab eventKey="labs" title="Labs@Home" />
            <Tab eventKey="playground" title="Playground" />
          </Tabs>
        </Col>
        {activeKey === "labs" && (
          <Col xs="auto">
            <Button
              variant="outline-primary"
              style={{
                float: "right",
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
            >
              ?
            </Button>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Header;
