import axios from "axios";
import { FC, ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { NavMenu } from "./NavMenu";

interface Props {
  children: ReactNode;
  setUser?: any;
}

export const Layout: FC<Props> = (props: Props) => {
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
  }, []);

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
