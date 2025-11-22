import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Header from "./components/Header";

function PlaygroundLayout() {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

export default PlaygroundLayout;
