import React from "react";
import Button from "react-bootstrap/Button";

interface LinkButtonProps {
  /** Text or child content inside the button */
  children: React.ReactNode;
  /** onClick handler or navigation logic */
  onClick?: () => void;
  /** Optional extra classes */
  className?: string;
  /** Disable state */
  disabled?: boolean;
  /** Custom color override (defaults to heading color) */
  color?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  onClick,
  className = "",
  disabled = false,
  color = "inherit",
}) => {
  return (
    <Button
      variant="link"
      onClick={onClick}
      disabled={disabled}
      className={`p-0 border-0 ${className}`}
      style={{
        background: "none",
        color,
        fontSize: "inherit",
        fontWeight: "inherit",
        textDecoration: "underline",
        verticalAlign: "baseline",
      }}
    >
      {children}
    </Button>
  );
};

export default LinkButton;
