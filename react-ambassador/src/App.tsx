import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { ProductsFrontend } from "./pages/ProductsFrontend";
import { Login } from "./pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsFrontend />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
