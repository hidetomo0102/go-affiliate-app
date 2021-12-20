import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

import "./Login.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios.post("login", {
      email,
      password,
    });

    setRedirect(true);
  };
  return (
    <>
      {redirect ? (
        <Navigate to="/" />
      ) : (
        <main className="form-signin">
          <form onSubmit={submitHandler}>
            <h1 className="h3 mb-3 fw-normal">Please Login in</h1>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Login in
            </button>
          </form>
        </main>
      )}
    </>
  );
};
