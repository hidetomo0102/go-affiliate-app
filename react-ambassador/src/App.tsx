import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { ProductsFrontend } from "./pages/ProductsFrontend";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Stats } from "./pages/Stats";
import { Rankings } from "./pages/Rankings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsFrontend />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/rankings" element={<Rankings />} />
      </Routes>
    </BrowserRouter>
  );
}
