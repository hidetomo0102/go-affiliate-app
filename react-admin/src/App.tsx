import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { RedirectToUsers } from "./components/RedirectToUsers";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Users } from "./pages/Users";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToUsers />} />
          <Route path="/users" element={<Users />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
