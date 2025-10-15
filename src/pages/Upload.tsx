import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate } from "react-router-dom";
import "../main.css";
import WarningMessage from "../components/WarningMessage";
import Button from "react-bootstrap/esm/Button";
import FileUploadBox from "../components/FileUploadBox";


function Upload() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Upload Starting File</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <Row>
                <Col>
                    <h1 className="pb-4">Upload the Professor's Starting File for Assignment {2}</h1>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <WarningMessage>
                        Warning: make sure to{" "}
                        <Button
                            variant="link"
                            onClick={() => navigate("/download")}
                            style={{
                            padding: 0,
                            color: "var(--warning-orange)",
                            fontSize: "inherit",
                            fontWeight: "inherit",
                            verticalAlign: "baseline",
                            }}
                        >
                            download Assignment {1}
                        </Button>{" "}
                        before uploading Assignment {2}.
                    </WarningMessage>
                </Col>
            </Row>
            <Row>
                <Col className="px-5 pb-4">
                    <h6><i>Files must be uploaded in the order provided by the professor</i></h6>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <FileUploadBox />
                </Col>
            </Row>
            <TwoButtonRow
                leftButtonText="Upload"
                leftButtonOnClick={() => console.log("upload")}
                rightButtonText="Cancel"
                rightButtonOnClick={() => navigate("/")}
                />
        </Container>
       
       
    );
}

export default Upload;