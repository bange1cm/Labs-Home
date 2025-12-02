import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function Initialize() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [globalid, setGlobalid] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInitialize = async () => {
    setIsInitializing(true);
    setError(null);

    // validate input (local part required)
    if (globalid.trim() === "") {
      setValidationError("Global ID is required.");
      setIsInitializing(false);
      return;
    }

    // send only the local part to the backend
    const localPart = globalid.trim();

    try {
      // clear any previous validation error
      setValidationError(null);
      await invoke("run_initialization", { globalid: localPart });
      // Navigate to home after successful initialization
      navigate("/");
    } catch (err) {
      setError(err as string);
      setIsInitializing(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>Welcome to Labs@Home</h1>
        <p style={{ marginBottom: "30px", color: "#6c757d" }}>
          This is your first time running the application. Click the button
          below to complete the initial setup.
        </p>

        {error && (
          <Alert variant="danger" style={{ marginBottom: "20px" }}>
            <strong>Error:</strong> {error}
          </Alert>
        )}

        {!isInitializing && (
          <Form.Group
            controlId="globalId"
            style={{ marginBottom: "20px", textAlign: "left" }}
          >
            <Form.Label>Global ID</Form.Label>
            <InputGroup>
              <Form.Control
                value={globalid}
                onChange={(e) => {
                  setGlobalid(e.target.value);
                }}
                aria-label="Global ID"
                disabled={isInitializing}
              />
              <InputGroup.Text>@cmich.edu</InputGroup.Text>
            </InputGroup>
            {validationError && (
              <Form.Text className="text-danger">{validationError}</Form.Text>
            )}
          </Form.Group>
        )}

        <Button
          variant="primary"
          size="lg"
          onClick={handleInitialize}
          disabled={isInitializing}
          style={{ minWidth: "200px" }}
        >
          {isInitializing ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{ marginRight: "8px" }}
              />
              Initializing...
            </>
          ) : (
            "Initialize"
          )}
        </Button>

        {isInitializing && (
          <p style={{ marginTop: "20px", color: "#6c757d", fontSize: "14px" }}>
            This may take a few moments. Please do not close the application.
          </p>
        )}
      </div>
    </div>
  );
}

export default Initialize;
