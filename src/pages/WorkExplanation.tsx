import { Container, Row, Col } from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import FileManagementImg from "../assets/FileManagement.png";

function WorkExplanation() {
  const navigate = useNavigate();

  return (
    <Container>
      <Row>
        <Col>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/help">Help</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                How Labs@Home Works
              </li>
            </ol>
          </nav>
        </Col>
      </Row>
      <Row>
        <Col>
          <h1 className="pb-4">How Labs@Home Works</h1>
        </Col>
      </Row>
      <Row>
        <Col className="px-5">
          <h3>Overview</h3>
          <p>
            Labs@Home lets you work on a Debian Linux computer that runs inside
            your own computer. This “computer inside a computer” is called a
            virtual machine (VM).
          </p>
          <p>
            Your main actions within Labs@Home are:
            <ul>
              <li>
                Launch Assignment: Opens the VM for your current assignment.
              </li>
              <li>
                Save Assignment: Saves your current assignment work to your
                computer’s Downloads folder.
              </li>
              <li>
                Upload Professor's Starting File: Uploads the professor's
                starting file to update your VM for the next assignment.
              </li>
            </ul>
          </p>
        </Col>
      </Row>
      <br className="pt-3" />
      <Row>
        <Col className="px-5">
          <h3>Deep Dive</h3>
        </Col>
      </Row>
      <Row>
        <Col className="px-5">
          <h5>QEMU</h5>
          <p>
            QEMU is a program that lets your computer run a virtual machine
            (VM). When you launch an Assignment in Labs@Home, you are opening a
            Debian Linux VM powered by QEMU.
          </p>
          <p>
            Even though it feels like a separate computer, everything in the VM
            is stored in files on your real computer. QEMU treats these files
            like the VM’s hard drive, memory, and system state.
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="px-5">
          <h5>QCOW2 Files</h5>
          <p>
            QEMU stores the VM’s “hard drive” in special files called QCOW2
            files. This format keeps the files small and allows Labs@Home to
            track changes without saving the entire VM each time.
          </p>
          <p>
            In Labs@Home, QCOW2 files are used for:
            <ul>
              <li>the starting VM state (the base system), and</li>
              <li>the changes you make during an Assignment.</li>
            </ul>
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="px-5">
          <h5>Backing/Base and Overlay Files</h5>
          <p>
            Every VM starts with a backing file (also called a base file). This
            file is the clean, original VM state that all students share.
          </p>
          <p>
            When you start an Assignment, Labs@Home creates an overlay file.
            This overlay records only the changes you make, like edited files or
            system changes. The base file stays untouched.
          </p>
          <p>
            When your professor gives you a new starting file for the next
            Assignment, that file is simply the professor’s overlay. Labs@Home
            merges the professor’s overlay with your base file to create an
            updated starting point for everyone. After that, Labs@Home generates
            a fresh overlay file for your own work for the new Assignment.
          </p>
        </Col>
      </Row>
      <Row>
        <Col className="px-5">
          <img
            src={FileManagementImg}
            alt="File Management Diagram"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Col>
      </Row>
      <br className="pt-3" />
      <Row>
        <Col className="px-5">
          <h5>Playground</h5>
          <p>
            Labs@Home also includes a separate playground VM, which uses its own
            base and overlay files so you can freely experiment without
            affecting your assignment progress.
          </p>
        </Col>
      </Row>
      <br className="pt-3" />
      <Row>
        <Col className="px-5 py-4">
          <TwoButtonRow
            rightButtonText="Dismiss"
            rightButtonOnClick={() => navigate("/help")}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default WorkExplanation;
