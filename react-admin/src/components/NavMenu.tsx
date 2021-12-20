import axios from "axios";
import { FC } from "react";
import { Link } from "react-router-dom";
import { UserData } from "../models/User";

interface Props {
  user?: UserData;
}

export const NavMenu: FC<Props> = (props: Props) => {
  const { user } = props;

  const LogoutHandler = async () => {
    await axios.post("logout");
  };

  return (
    <nav
      id="sidebarMenu"
      className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
    >
      <div className="position-sticky pt-3">
        <ul className="nav flex-column">
          <Link to="/profile" className="p-2 text-white text-decoration-none">
            {user?.first_name} {user?.last_name}
          </Link>
          <Link
            to="/login"
            className="p-2 text-white text-decoration-none"
            onClick={LogoutHandler}
          >
            Log out
          </Link>
        </ul>
      </div>
    </nav>
  );
};
