import "bootstrap-icons/font/bootstrap-icons.css";
import React from "react";

interface WarningMessageProps {
  children: React.ReactNode;
}

const WarningMessage: React.FC<WarningMessageProps> = ({ children }) => {
  return (
    <div className="pb-4"
      style={{
        color: "var(--warning-orange)",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <i
        className="bi bi-exclamation-triangle-fill"
        style={{
          color: "var(--warning-orange)",
          fontSize: "1.25rem",
          flexShrink: 0,
          marginRight: "0.2rem",
        }}
        aria-hidden="true"
      ></i>
      <h3
        style={{
          margin: 0,
          fontSize: "1.25rem",
          fontWeight: 600,
          lineHeight: 1.3,
        }}
      >
        {children}
      </h3>
    </div>
  );
};

export default WarningMessage;
