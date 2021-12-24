import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import { UserData } from "../models/user";

interface Props {
  user: UserData;
  setUser: React.Dispatch<UserData>;
}

export const Profile: FC<Props> = (props: Props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { user, setUser } = props;

  const infoSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data: UserData = await axios.put(`users/info`, {
      first_name: firstName,
      last_name: lastName,
      email: email,
    });

    setUser(data);
  };

  const passwordSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await axios.put(`user/password`, {
      password: password,
      password_config: passwordConfirm,
    });
  };

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setEmail(user.email);
  }, [user]);

  return (
    <Layout>
      <h3>Account Information</h3>
      <form onSubmit={infoSubmit}>
        <div className="mb-3">
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>

      <h3 className="mt-4">Change Password</h3>
      <form onSubmit={passwordSubmit}>
        <div className="mb-3">
          <TextField
            label="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <TextField
            label="Password Confirm"
            type="password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
    </Layout>
  );
};
