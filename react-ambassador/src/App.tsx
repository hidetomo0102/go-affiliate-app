import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { ProductsFrontend } from "./pages/ProductsFrontend";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ProductsFrontend} />
      </Routes>
    </BrowserRouter>
  );
}
