import axios from "axios";
import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { User } from "../models/user";

interface Props {
  user: User;
  setUser: any;
}

export const NavMenu: FC<Props> = (props: Props) => {
  const { user, setUser } = props;

  const logoutHandler = async () => {
    await axios.post("logout");
    setUser(null);
  };

  let menu;
  if (user.id) {
    menu = (
      <div className="col-md-3 text-end">
        <Link to="/rankings" className="btn me-2">
          Rankings
        </Link>
        <Link to="/stats" className="btn me-2">
          Stats
        </Link>
        <a
          href="/login"
          className="btn btn-outline-primary me-2"
          onClick={logoutHandler}
        >
          Logout
        </a>
        <Link to="/profile" className="btn btn-primary">
          {props.user.first_name} {props.user.last_name}
        </Link>
      </div>
    );
  } else {
    menu = (
      <div className="col-md-3 text-end">
        <Link to="/login" className="btn btn-outline-primary me-2">
          Login
        </Link>
        <Link to="/register" className="btn btn-primary">
          Sign-up
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
        <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
          <li>
            <NavLink
              to="/"
              className={(isActive) =>
                "nav-link px-2 link-secondary " + (isActive ? "link-dark" : "")
              }
            >
              Frontend
            </NavLink>
          </li>
          <li>
            <NavLink
              to={"/backend"}
              className={(isActive) =>
                "nav-link px-2 link-secondary " + (isActive ? "link-dark" : "")
              }
            >
              Backend
            </NavLink>
          </li>
        </ul>
        {menu}
      </header>
    </div>
  );
};
