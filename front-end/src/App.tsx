import { Route, Routes } from "react-router";
import "./App.css";

import Booking from "./pages/Booking";
import Register from "./pages/Register";
import Event from "./pages/Event";
import Login from "./pages/Login";
import Navbar04Page from "./components/navbar-04/navbar-04";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Navbar04Page />}>
          <Route path="/" element={<Event />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="event" element={<Event />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
