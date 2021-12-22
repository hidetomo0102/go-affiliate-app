import axios from "axios";
import { FC, ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { UserData } from "../models/user";
import { Header } from "./Header";
import { NavMenu } from "./NavMenu";

interface Props {
  children: ReactNode;
  setUser?: React.Dispatch<UserData>;
}

export const Layout: FC<Props> = (props: Props) => {
  const [redirect, setRedirect] = useState(false);

  const getUser = async () => {
    try {
      const { data } = await axios.get("user");
    } catch (e: any) {
      setRedirect(true);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const { children, setUser } = props;

  return (
    <>
      {redirect ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Header />
          <div className="container-fluid">
            <div className="row">
              <NavMenu />
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <div className="table-responsive">{children}</div>
              </main>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
