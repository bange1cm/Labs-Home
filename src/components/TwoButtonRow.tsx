// import React from "react";
// import { Row, Col, Button } from "react-bootstrap";

// interface TwoButtonRowProps {
//   leftButtonText?: string;
//   leftButtonOnClick?: () => void;
//   rightButtonText: string;
//   rightButtonOnClick: () => void;
// }

// const TwoButtonRow: React.FC<TwoButtonRowProps> = ({
//   leftButtonText,
//   leftButtonOnClick,
//   rightButtonText,
//   rightButtonOnClick,
// }) => {
//   return (
//     <Row
//       className="py-5"
//       style={{ textAlign: "center" }}
//     >
//       <Col xs={6} md={4} className="d-flex justify-content-center ms5">
//         {leftButtonText && (
//           <Button size="lg"variant="primary" onClick={leftButtonOnClick}>
//             {leftButtonText}
//           </Button>
//         )}
//       </Col>

//       <Col xs={6} md={4} className="d-flex justify-content-center">
//         <Button size="lg"variant="secondary" onClick={rightButtonOnClick}>
//           {rightButtonText}
//         </Button>
//       </Col>
//     </Row>
//   );
// };

// export default TwoButtonRow;

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
    <Row className="py-5 gx-3"> {/* gx-3 adds spacing between buttons */}
      {leftButtonText && (
        <Col xs="auto">
          <Button size="lg" variant="primary" onClick={leftButtonOnClick}>
            {leftButtonText}
          </Button>
        </Col>
      )}

      <Col xs="auto">
        <Button size="lg" variant="secondary" onClick={rightButtonOnClick}>
          {rightButtonText}
        </Button>
      </Col>
    </Row>
  );
};

export default TwoButtonRow;







