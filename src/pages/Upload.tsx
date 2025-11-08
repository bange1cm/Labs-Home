import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import WarningMessage from "../components/WarningMessage";
import Button from "react-bootstrap/esm/Button";
import FileUploadBox from "../components/FileUploadBox";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";
import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core"; 
import { useNavigate } from "react-router-dom";
import { useActivityLog } from "../hooks/useActivityLog";
import "../main.css";


function Upload() {
    const navigate = useNavigate();
    const {currentAssignment, loadAssignment} = useAssignmentCounter();
    const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
    const { addActivity } = useActivityLog();

    useEffect(() => {
        loadAssignment();
    }, []);

    const handleUpload = async () => {
        if (!selectedFilePath) {
            alert("Please select a file first.");
            return;
        }

        try {
            await invoke("process_uploaded_file", {
                filePath: selectedFilePath,
                assignmentNumber: currentAssignment,
            });
            alert("File successfully copied and processed!");
            navigate("/");
        } catch (error) {
            addActivity(`Failed to upload file: ${error}`);
        }
    };

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
                    <FileUploadBox onFileSelect={setSelectedFilePath}/>
                </Col>
            </Row>
            <TwoButtonRow
                leftButtonText="Upload"
                leftButtonOnClick={handleUpload}
                rightButtonText="Cancel"
                rightButtonOnClick={() => navigate("/")}
                />
        </Container>
       
       
    );
}

export default Upload;