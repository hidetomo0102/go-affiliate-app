import axios from "axios";
import { SyntheticEvent, useState } from "react";
import { Navigate } from "react-router-dom";

export const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [redirect, setRedirect] = useState(false);

  const onSubmitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios.post("register", {
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    setRedirect(true);
  };

  return (
    <>
      {redirect ? (
        <Navigate to="/login" />
      ) : (
        <main className="form-signin">
          <form onSubmit={onSubmitHandler}>
            <h1 className="h3 mb-3 fw-normal">Please register</h1>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <label>First Name</label>
            </div>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                onChange={(e) => setLastName(e.target.value)}
              />
              <label>Last Name</label>
            </div>
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
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password Confirm"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <label>Password Confirm</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Submit
            </button>
          </form>
        </main>
      )}
    </>
  );
};
