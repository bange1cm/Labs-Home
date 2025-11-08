import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { open } from '@tauri-apps/plugin-dialog';
import "./FileUploadBox.css"; 

interface FileUploadBoxProps {
  onFileSelect: (filePath: string | null) => void;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({ onFileSelect }) => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handleSelectFile = async () => {
    const selected = await open({
      multiple: false,
      filters: [{ name: "QCOW2 images", extensions: ["qcow2"] }],
    });

    if (typeof selected === "string") {
      setSelectedPath(selected);
      onFileSelect(selected);
    }
  };

  return (
     <Card
      className="p-4 text-center mb-4"
      style={{
        border: "2px solid var(--bs-primary)",
        backgroundColor: "rgba(13, 110, 253, 0.05)",
        borderRadius: "1rem",
      }}
    >
      <p className="fw-semibold mb-3" style={{ fontSize: "1.1rem" }}>
        {selectedPath
          ? `File selected:\n${selectedPath}`
          : "Select a .qcow2 image file"}
      </p>
      <Button onClick={handleSelectFile} variant="primary">
        Choose File
      </Button>
    </Card>
  );
};

export default FileUploadBox;
