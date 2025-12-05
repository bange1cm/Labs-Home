import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Header from "./components/Header";
import { useLaunchContext } from "./contexts/LaunchContext";

function MainLayout() {
  let launching = false;

  // Try to get launching state from context if available
  try {
    const context = useLaunchContext();
    launching = context.launching;
  } catch {
    // Context not available, which is fine for non-launch pages
  }

  return (
    <>
      <Header disabled={launching} />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default MainLayout;
