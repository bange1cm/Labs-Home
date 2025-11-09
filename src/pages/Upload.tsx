import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import WarningMessage from "../components/WarningMessage";
import Button from "react-bootstrap/esm/Button";
import FileUploadBox from "../components/FileUploadBox";
import { uploadAssignment } from "../hooks/uploadAssignment";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../main.css";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";


function Upload() {
    const navigate = useNavigate();
    const {currentAssignment, loadAssignment} = useAssignmentCounter();
    const [selectedFilePath, setSelectedFilePath] =  useState<string | null>(null);
    const {upload, error, uploaded} = uploadAssignment(selectedFilePath);
    const [flag, setFlag] = useState(false);


    const handleUpload = () => {
        if (!selectedFilePath) {
            setFlag(true);
        }
        else{
            upload();
        }
    };

    useEffect(() => {
        loadAssignment();
    }, []);

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
            <>{error ? (
                <>
                <Row>
                    <Col>
                    <h1 className="pb-4 text-danger">Failed to Upload</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="px-5">
                            There was an error trying to upload assignment{" "}
                            {currentAssignment != null ? currentAssignment + 1 : "Loading..."}. 
                            Please check the{" "}
                            <Link to="/activity-log">Activity Log</Link> for more details.
                        </p>
                        <p className="px-5 text-muted small">
                            Error details: <code>{error}</code>
                        </p>
                    </Col>
                </Row>
                <Row>
                        <Col className="pt-5">
                            <TwoButtonRow 
                            rightButtonText="Dismiss"
                            rightButtonOnClick={() => navigate("/")}
                            />
                        </Col>
                    </Row>
                </>
            ) : uploaded ? (
                <>
                <Row>
                    <Col>
                        <h1 className="pb-4">Successfully Uploaded Assignment {currentAssignment ?? "Loading..."}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="pt-5">
                        <TwoButtonRow 
                        rightButtonText="Dismiss"
                        rightButtonOnClick={() => navigate("/")}
                         />
                     </Col>
                </Row>
                </>
            ) : (
            <>
            <Row>
                <Col>
                    <h1 className="pb-4">Upload the Professor's Starting File for Assignment {currentAssignment != null ? currentAssignment + 1 : "Loading..."}</h1>
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
                            download Assignment {currentAssignment ?? "Loading..."}
                        </Button>{" "}
                        before uploading Assignment {currentAssignment != null ? currentAssignment + 1 : "Loading..."}.
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
                    <FileUploadBox onFileSelect={setSelectedFilePath} flag={flag} />
                </Col>
            </Row>
            {flag ? (
            <Row>
                <Col className="px-5" style={{color: "red", fontWeight: "bold", fontSize: "1.1rem"}}>
                    No file selected. Please select a file to upload.
                </Col>
            </Row>
            ) : null}
            <div className="px-5">
            <TwoButtonRow 
                leftButtonText="Upload"
                leftButtonOnClick={handleUpload}
                rightButtonText="Cancel"
                rightButtonOnClick={() => navigate("/")}
                />
            </div>
            </>)}</>
        </Container>
       
       
    );
}

export default Upload;