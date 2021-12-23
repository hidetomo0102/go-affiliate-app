import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { RedirectToUsers } from "./components/RedirectToUsers";
import { Links } from "./pages/Links";
import { Login } from "./pages/Login";
import { Products } from "./pages/products";
import { CreateProduct } from "./pages/products/createProduct";
import { Register } from "./pages/Register";
import { Users } from "./pages/Users";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id/links" element={<Links />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/:id/edit" element={<CreateProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
