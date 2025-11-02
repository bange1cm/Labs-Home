import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import TwoButtonRow from "../components/TwoButtonRow";
import { useNavigate, Link } from "react-router-dom";
import LoginHintCard from "../components/LoginHintCard";
import { useAssignmentCounter } from "../hooks/useAssignmentCounter";
import { useActivityLog } from "../hooks/useActivityLog";
import { useEffect, useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";


function Launch() {
    const navigate = useNavigate();
    const {currentAssignment, loadAssignment} = useAssignmentCounter();
    const { addActivity } = useActivityLog();
    const [error, setError] = useState<string | null>(null);
    const [launching, setLaunching] = useState(true);


    const launchedRef = useRef(false);

    useEffect(() => {
        if (launchedRef.current) return; // guard against React StrictMode double-invoke in dev
        launchedRef.current = true;

        async function launchQemu() {
            let loadedAssignment: number | null = null;
            try {
                // load assignment and capture the returned value so we can log it reliably
                loadedAssignment = await loadAssignment();
                await invoke("launch_qemu"); // call Rust backend command; returns immediately

                // start a polling fallback in case events aren't delivered: call is_qemu_running
                let pollHandle: number | null = null;
                try {
                    // wait a short moment for the launch to start
                    await new Promise((r) => setTimeout(r, 500));
                    pollHandle = window.setInterval(async () => {
                        try {
                            // call backend command
                            // @ts-ignore - invoke typing
                            const res = await invoke("is_qemu_running");
                            // result may be boolean; coerce
                            const running = !!res;
                            if (!running) {
                                setLaunching(false);
                                // log activity - prefer the loaded value if available
                                await addActivity(`Closed Assignment ${loadedAssignment ?? currentAssignment ?? "?"}`);
                                if (pollHandle) {
                                    clearInterval(pollHandle);
                                    pollHandle = null;
                                }
                            }
                        } catch (e) {
                            //log error
                            setError(String(e));
                            await addActivity(`Error polling QEMU status: ${e}`);
                        }
                    }, 1000);
                } catch (e) {
                    setError(String(e));
                    await addActivity(`Error setting up QEMU polling: ${e}`);
                }

            } catch (err: any) {
                //log err 
                setError(err?.message ?? err);
                await addActivity(`Frontend error launching QEMU: ${err?.message ?? err}`);
                setLaunching(false);
            }
        }

        // start the launch (which starts polling after load)
        launchQemu();
    }, []);

    return(
        <Container>
            <Row>
                <Col>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Launch Assignment</li>
                        </ol>
                    </nav>
                </Col>
            </Row>
            <>{error ? (
                <>
                <Row>
                    <Col>
                    <h1 className="pb-4 text-danger">Failed to Launch</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <p className="px-5">
                            There was an error trying to launch assignment{" "}
                            {currentAssignment ?? "?"}.  
                            Please check the{" "}
                            <Link to="/activity-log">Activity Log</Link> for more details.
                        </p>
                        <p className="px-5 text-muted small">
                            Error details: <code>{error}</code>
                        </p>
                    </Col>
                </Row>
                </>
                ) : launching ? (
                    <>
                    <Row>
                        <Col>
                            <h1 className="pb-4">Launching Assignment {currentAssignment ?? "Loading..."} in a new terminal</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5">
                            <LoginHintCard />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5">
                            <h6><i>Password will be hidden when typing</i></h6>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="px-5 pb-4">
                            <h6><i>Close terminal when done. You will then be able to return to the main menu.</i></h6>
                        </Col>
                    </Row>
                    </>
                ) : (
                    <>
                    <Row>
                        <Col>
                            <h1 className="pb-4">Assignment {currentAssignment ?? "Loading..."} Closed</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="pt-5">
                            <TwoButtonRow 
                            rightButtonText="Dismiss"
                            rightButtonOnClick={() => navigate("/")}
                            />
                        </Col>
                    </Row>
                    </>
                )}
            </>
        </Container>
    );
}

export default Launch;