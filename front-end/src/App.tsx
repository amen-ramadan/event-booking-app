import { Route, Routes } from "react-router";
import "./App.css";

import Booking from "./pages/Booking";
import Register from "./pages/Register";
import Event from "./pages/Event";
import Login from "./pages/Login";
import Navbar04Page from "./components/navbar-04/navbar-04";
import AuthContext from "./context/auth-context.tsx";
import { useState } from "react";

function App() {
  // local storage initialization and insert value into the context
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || ""
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId") || ""
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("username") || ""
  );

  const login = (
    username: string | null,
    userToken: string | null,
    loginUserId: string | null
  ) => {
    if (username) {
      setUsername(username);
      localStorage.setItem("username", username);
    }
    if (userToken) {
      setToken(userToken);
      localStorage.setItem("token", userToken);
    }
    if (loginUserId) {
      setUserId(loginUserId);
      localStorage.setItem("userId", loginUserId);
    }
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    setUsername(null);
    localStorage.clear();
  };

  return (
    <>
      <AuthContext.Provider value={{ token, userId, username, login, logout }}>
        <Routes>
          <Route element={<Navbar04Page />}>
            <Route path="/" element={<Event />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            {!token && <Route path="event" element={<Login />} />}
            <Route path="event" element={<Event />} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    </>
  );
}

export default App;
