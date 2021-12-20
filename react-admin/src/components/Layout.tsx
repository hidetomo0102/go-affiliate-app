import axios from "axios";
import { FC, ReactChild, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { UserData } from "../models/User";
import { Header } from "./Header";
import { NavMenu } from "./NavMenu";

interface Props {
  children: ReactChild;
}

export const Layout: FC<Props> = (props: Props) => {
  const [redirect, setRedirect] = useState(false);
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axios.get("user");
      } catch (e: any) {
        setRedirect(true);
      }
    };
    getUser();
  }, []);

  const { children } = props;

  return (
    <>
      {redirect ? (
        <Navigate to="/" />
      ) : (
        <div>
          <Header />
          <div className="container-fluid">
            <div className="row">
              <NavMenu user={user} />
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
