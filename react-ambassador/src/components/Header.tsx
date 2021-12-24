import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/user";

interface Props {
  user: User;
}

export const Header: FC<Props> = (props: Props) => {
  const [title, setTitle] = useState("Welcome");
  const [description, setDescription] = useState("Share links");

  const { user } = props;

  let buttons;
  if (!user.id) {
    buttons = (
      <p>
        <Link to="/login" className="btn btn-primary my-2">
          Login
        </Link>
        <Link to="/register" className="btn btn-secondary my-2">
          Register
        </Link>
      </p>
    );
  }

  useEffect(() => {
    if (user.id) {
      setTitle(`$${user.revenue}`);
      setDescription("Your earnings so far");
    }
  });

  return (
    <section className="py-5 text-center container">
      <div className="row py-lg-5">
        <div className="col-lg-6 col-md-8 mx-auto">
          <h1 className="fw-light">{title}</h1>
          <p className="lead text-muted">{description}</p>
          {buttons}
        </div>
      </div>
    </section>
  );
};
