import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { RedirectToUsers } from "./components/RedirectToUsers";
import { Links } from "./pages/Links";
import { Login } from "./pages/Login";
import { Products } from "./pages/products/Products";
import { CreateProduct } from "./pages/products/CreateProduct";
import { Register } from "./pages/Register";
import { Users } from "./pages/Users";
import { Orders } from "./pages/Orders";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RedirectToUsers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id/links" element={<Links />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/products/:id/edit" element={<CreateProduct />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
