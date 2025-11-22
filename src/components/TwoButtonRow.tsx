import React from "react";
import { Row, Col, Button } from "react-bootstrap";

interface TwoButtonRowProps {
  leftButtonText?: string;
  leftButtonOnClick?: () => void;
  rightButtonText: string;
  rightButtonOnClick: () => void;
}

const TwoButtonRow: React.FC<TwoButtonRowProps> = ({
  leftButtonText,
  leftButtonOnClick,
  rightButtonText,
  rightButtonOnClick,
}) => {
  return (
    <Row className="py-1 gx-3">
      {" "}
      {/* gx-3 adds spacing between buttons */}
      {leftButtonText && (
        <Col xs="auto">
          <Button variant="primary" onClick={leftButtonOnClick}>
            {leftButtonText}
          </Button>
        </Col>
      )}
      <Col xs="auto">
        <Button variant="secondary" onClick={rightButtonOnClick}>
          {rightButtonText}
        </Button>
      </Col>
    </Row>
  );
};

export default TwoButtonRow;
