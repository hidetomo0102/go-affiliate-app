import axios from "axios";
import { FC, ReactNode, useEffect } from "react";
import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import { Dispatch } from "redux";
import { User } from "../models/user";
import { setUser, setUserActionType } from "../redux/actions/userActions";

import Header from "./Header";
import NavMenu from "./NavMenu";

interface Props {
  children: ReactNode;
  setUser: setUserActionType;
}

const Layout: FC<Props> = (props: Props) => {
  const { children, setUser } = props;

  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get("user");
        setUser(data);
      } catch (e) {
        console.log(e);
      }
    };
    getUser();
  }, [setUser]);

  let header;
  if (location.pathname === "/" || location.pathname === "/backend") {
    header = <Header />;
  }
  return (
    <div>
      <NavMenu />
      <main>
        {header}
        <div className="album py-5 bg-light">
          <div className="container">{children}</div>
        </div>
      </main>
    </div>
  );
};

const mapState = (state: { user: User | null }) => ({
  user: state.user,
});

const mapDispatch = (dispatch: Dispatch) => ({
  setUser: (user: User | null) => dispatch(setUser(user)),
});

export default connect(mapState, mapDispatch)(Layout);
