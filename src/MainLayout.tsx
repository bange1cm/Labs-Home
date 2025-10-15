import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/esm/Container";
import Header from "./components/Header";

function MainLayout() {

  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>

    </>

  );
}

export default MainLayout;