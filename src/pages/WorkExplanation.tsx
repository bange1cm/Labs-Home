import {Container, Row, Col} from "react-bootstrap";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";

function WorkExplanation() {
    const navigate = useNavigate();

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/help">Help</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">How Labs@Home Works</li>
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
                    <h3>QEMU</h3>
                    <p>QEMU is a program that lets you run virtual computers (called virtual machines) on your own computer. 
                        When you launch an Assignment through Labs@Home, you are using a Debian virtual machine powered by QEMU.
                        This virtual machine acts like its own system with its own hard drive, even though that “hard drive” is actually just a file on your own computer. 
                    </p>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <h3>QCOW2 Files</h3>
                    <p>QEMU uses disk image files to store all the data for a virtual machine.
                    One common format is QCOW2 (short for QEMU Copy-On-Write). 
                    Labs@Home uses QCOW2 files to manage the virtual "hard drive" of your Debian machine.</p>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
                    <h3>Backing and Overlay Files</h3>
                    <p>Each virtual machine starts with a backing file, which acts as the base system image.
                        This backing file is used to create overlay files, which store any changes made to the virtual machine.
                        For each Assignment, Labs@Home creates a new overlay file that builds on the backing file.  </p>
                        <p>When your professor asks you to start a new Assignment and provides a starting file, that starting file is actually just an overlay file from your professor.
                        Labs@Home merges the professor's overlay file with your current backing file to prepare your Debian virtual machine for the next Assignment. 
                        After that, Labs@Home creates a new overlay file for your assignment changes, and you're ready to work!</p>
                    <h6>Think of it like layers in an art project</h6>
                    <p>The backing file is the base layer, a clean, unchangeable image that everyone starts from.
                        Your overlay file is a transparent layer on top where you make your own edits, like adding color or text.
                        When your professor gives you a starting file / professor overlay, it’s like they’ve painted an update on top of the shared base layer.</p>
                </Col>
            </Row>
            <Row>
                <Col className="px-5">
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