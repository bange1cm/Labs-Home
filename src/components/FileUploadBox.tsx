import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import "./FileUploadBox.css"; 

const FileUploadBox: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <Card
      className="p-4 text-center mb-4"
      style={{
        border: "2px solid var(--bs-primary)",
        backgroundColor: "rgba(13, 110, 253, 0.05)", // very light blue
        borderRadius: "1rem",
      }}
    >
      <Form.Group controlId="fileUpload">
        <Form.Label
          htmlFor="fileUpload"
          className="mb-3 fw-semibold"
          style={{ fontSize: "1.2rem" }}
        >
          {selectedFile ? "File Selected:" : "Upload q2cow file"}
        </Form.Label>

        <Form.Control
          id="fileUpload"
          type="file"
          onChange={handleFileChange}
          className="link-file-input"
        />
      </Form.Group>
    </Card>
  );
};

export default FileUploadBox;
